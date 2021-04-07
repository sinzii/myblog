const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const UserDTOSchema = require('../validations/UserDTO');
const ResourceNotFoundError = require('../exceptions/404Error');
const InvalidSubmissionDataError = require('../exceptions/InvalidSubmissionDataError');

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
        userDTO = await UserDTOSchema.CreateUserDTOSchema.doValidate(userDTO, {
            stripUnknown: true,
            abortEarly: false,
        });
        await this._addHashPassword(userDTO);

        const newUser = new User(userDTO);
        return await newUser.save();
    }

    /**
     * @param userId
     * @param userDTO
     * {
     *     name: 'First Last',
     *     username: 'an_unique_name',
     *     email: 'an_unique_email',
     *     password: 'password_to_change',
     *     avatar: 'https://path/to/avatar_image'
     * }
     */
    async update(userId, userDTO) {
        userDTO = await UserDTOSchema.UpdateUserDTOSchema.doValidate(userDTO, {
            stripUnknown: true,
            abortEarly: false,
        });

        const targetUser = await this.findOne(userId);

        await this._addHashPassword(userDTO, targetUser.salt);
        if (targetUser.passwordHash === userDTO.passwordHash) {
            throw new InvalidSubmissionDataError(undefined, {
                password: 'Please use a new password for your security',
            });
        }

        await targetUser.updateOne(
            {
                $set: userDTO,
            },
            {
                runValidators: true
            }
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

    async updatePassword(userId, newPassword) {
        const targetUser = await this.findOne(userId);
        const { passwordHash, salt } = this.hashingPassword(newPassword);
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
                crypto.pbkdf2(rawPassword, salt, 10000, 100, 'sha512', function (err, derivedKey) {
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
        targetUser.active = false;
        return await targetUser.save();
    }

    async findAll(searchQuery, offset = 0, limit = 10) {
        let userFilterConditions = {};
        if (searchQuery) {
            searchQuery = String(searchQuery).replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, '\\$&');
            userFilterConditions = {
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
            };
        }

        return await User.find(userFilterConditions)
            .skip(offset)
            .limit(limit)
            .sort({ createdAt: -1 })
            .exec();
    }

    async findOne(userId, throwError = true) {
        const user = await User.findById(userId);
        if (user) {
            return user;
        }

        if (throwError) {
            throw new ResourceNotFoundError('User is not existed');
        }

        return null;
    }
}

module.exports = new UserService();
