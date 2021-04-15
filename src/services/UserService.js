const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const UserValidations = require('../validations/user');
const ResourceNotFoundError = require('../exceptions/404Error');
const InvalidSubmissionDataError = require('../exceptions/InvalidSubmissionDataError');
const validator = require('validator');

class UserService {
    /**
     * @param userDTO
     * {
     *     name: 'First Last',
     *     username: 'an_unique_name',
     *     email: 'an_unique_email',
     *     password: 'a_raw_password_here',
     *     avatar: 'https://path/to/avatar_image'
     * }
     */
    async create(userDTO) {
        userDTO = await UserValidations.CreateUserValidationSchema.doValidate(userDTO, {
            stripUnknown: true,
            abortEarly: false,
        });

        await this._addHashPassword(userDTO);
        await this.checkUniqueUsernameAndEmail(userDTO.username, userDTO.email);

        const newUser = new User(userDTO);
        return await newUser.save();
    }

    async isUniqueEmail(email) {
        const existedUsers = await User.find({ email }).limit(1);
        return existedUsers.length === 0;
    }

    async isUniqueUsername(username) {
        const existedUsers = await User.find({ username }).limit(1);
        return existedUsers.length === 0;
    }

    async checkUniqueUsernameAndEmail(username, email) {
        const isUniqueUsername = await this.isUniqueUsername(username);
        const isUniqueEmail = await this.isUniqueEmail(email);

        const errors = {};
        if (!isUniqueUsername) {
            errors.username = 'This username has already been taken';
        }

        if (!isUniqueEmail) {
            errors.email = 'This email has already been taken';
        }

        const hasErrors = Object.keys(errors).length > 0;

        if (hasErrors) {
            throw new InvalidSubmissionDataError(undefined, errors);
        }
    }

    /**
     * @param userId
     * @param userDTO
     * {
     *     name: 'First Last',
     *     username: 'an_unique_name',
     *     email: 'an_unique_email',
     *     avatar: 'https://path/to/avatar_image'
     * }
     */
    async update(userId, userDTO) {
        userDTO = await UserValidations.UpdateUserValidationSchema.doValidate(userDTO, {
            stripUnknown: true,
            abortEarly: false,
        });

        const targetUser = await this.findOne(userId);

        await this.checkUniqueUsernameAndEmail(userDTO.username, userDTO.email);

        await targetUser.updateOne(
            {
                $set: userDTO,
            },
            {
                runValidators: true,
            },
        );

        return await this.findOne(userId);
    }

    async _addHashPassword(userDTO, currentSalt) {
        if (!userDTO.password) {
            return;
        }

        Object.assign(userDTO, await this.hashingPassword(userDTO.password, currentSalt));
        delete userDTO.password;
    }

    async updatePassword(userId, passwordDTO) {
        passwordDTO = await UserValidations.UpdatePasswordValidationSchema.doValidate(passwordDTO, {
            stripUnknown: true,
            abortEarly: false,
        });

        const targetUser = await this.findOne(userId);

        // check if current password is correct
        const currentPasswordDTO = { password: passwordDTO.currentPassword };
        await this._addHashPassword(currentPasswordDTO, targetUser.salt);
        if (currentPasswordDTO.passwordHash !== targetUser.passwordHash) {
            throw new InvalidSubmissionDataError(undefined, {
                password: 'Please use a new password for your security',
            });
        }

        // save new password
        const { passwordHash, salt } = this.hashingPassword(passwordHash.newPassword);
        targetUser.passwordHash = passwordHash;
        targetUser.salt = salt;

        await targetUser.save();
    }

    async hashingPassword(rawPassword, salt) {
        if (!salt) {
            salt = crypto.randomBytes(16).toString('hex');
        }

        function hashing() {
            return new Promise((resolve, reject) => {
                crypto.pbkdf2(rawPassword, salt, 10000, 100, 'sha512', function(err, derivedKey) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(derivedKey.toString('hex'));
                    }
                });
            });
        }

        const passwordHash = await hashing();

        return {
            passwordHash,
            salt,
        };
    }

    async isValidPassword(user, rawPasswordToCheck) {
        const { passwordHash } = await this.hashingPassword(rawPasswordToCheck, user.salt);
        return user.passwordHash === passwordHash;
    }

    async deactivate(userId) {
        const targetUser = await this.findOne(userId);
        targetUser.active = false;
        return await targetUser.save();
    }

    async activate(userId) {
        const targetUser = await this.findOne(userId);
        targetUser.active = true;
        return await targetUser.save();
    }

    async findAll({
                      searchQuery,
                      startingAfter,
                      endingBefore,
                      limit = '10',
                      active = 'true',
                  }) {
        active = validator.toBoolean(active);

        limit = validator.toInt(limit) || 10;
        limit = limit > 100 || limit <= 0 ? 10 : limit;

        const conditions = { active };
        const $and = [];
        if (searchQuery) {
            searchQuery = String(searchQuery).replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&');
            $and.push({
                $or: [
                    {
                        name: {
                            $regex: searchQuery,
                        },
                    },
                    {
                        username: {
                            $regex: searchQuery,
                        },
                    },
                    {
                        email: {
                            $regex: searchQuery,
                        },
                    },
                ],
            });
        }

        if (startingAfter) {
            $and.push({
                _id: {
                    $gt: startingAfter,
                },
            });
        } else if (endingBefore) {
            $and.push({
                _id: {
                    $lt: endingBefore,
                },
            });
        }

        if ($and.length > 0) {
            conditions.$and = $and;
        }

        return User.find(conditions)
            .sort({ createdAt: -1 })
            .limit(limit);
    }

    async findOne(userId, throwError = true) {
        const user = await User.findById(userId);
        if (user) {
            return user;
        }

        return this._returnNullOrThrowError(throwError);
    }

    async findOneByEmail(email, throwError = true) {
        const user = await User.findOne({ email });
        if (user) {
            return user;
        }

        return this._returnNullOrThrowError(throwError);
    }

    async findOneByUsername(username, throwError = true) {
        const user = await User.findOne({ username });
        if (user) {
            return user;
        }

        return this._returnNullOrThrowError(throwError);
    }

    _returnNullOrThrowError(throwError = true) {
        if (throwError) {
            throw new ResourceNotFoundError('User is not existed');
        }

        return null;
    }

    removeSensitiveInformation(users) {
        if (!users || users.length === 0) {
            return;
        }

        users.forEach(u => {
            u.set('passwordHash', undefined);
            u.set('salt', undefined);
        });

        return users;
    }
}

module.exports = new UserService();
