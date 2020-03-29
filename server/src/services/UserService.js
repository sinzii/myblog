const crypto = require('crypto');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const UserDTOSchema = require('../validations/UserDTO');
const ResourceNotFoundError = require('../exceptions/404');

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
        await UserDTOSchema.CreateUserDTOSchema.doValidate(userDTO, {stripUnknown: true, abortEarly: false});
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
     *     avatar: 'https://path/to/avatar_image'
     * }
     */
    async update(userId, userDTO) {
        await UserDTOSchema.UpdateUserDTOSchema.doValidate(userDTO, {stripUnknown: true, abortEarly: false});

        const targetUser = await this.findOne(userId);

        await this._addHashPassword(userDTO);
        // todo check if password is the same with current password

        return await targetUser.updateOne({
            $set: userDTO
        });
    }

    async _addHashPassword(userDTO) {
        if (!userDTO.password) {
            return;
        }

        Object.assign(userDTO, await this.hashingPassword(userDTO.password));
        delete userDTO.password;
    }

    async updatePassword(userId, newPassword) {
        const targetUser = await this.findOne(userId);
        const {passwordHash, salt} = this.hashingPassword(newPassword);
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
                crypto.pbkdf2(rawPassword, salt, 10000, 100, 'sha512',
                    function (err, derivedKey) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(derivedKey.toString('hex'));
                        }
                    })
            })
        }

        const passwordHash = await hashing();

        return {
            passwordHash,
            salt
        }
    }

    async isValidPassword(user, rawPasswordToCheck) {
        const {passwordHash} = await this.hashingPassword(rawPasswordToCheck, user.salt);
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
    }

    async findOne(userId, throwError = true) {
        try {
            return await User.findById(userId)
        } catch {
            if (throwError) {
                throw new ResourceNotFoundError('User is not existed');
            }
        }

        return null;
    }
}

module.exports = new UserService();