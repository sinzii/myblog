const mongoose = require('mongoose');
const assert = require('chai').assert;

describe('Test UserService', () => {
    before(async function () {
        const User = mongoose.model('User');
        await User.deleteMany();
    });

    after(async () => {
        const User = mongoose.model('User');
        await User.deleteMany();
    });

    describe('Create user', () => {
        it('Create new user with valid data', async () => {
            const userDTO = {
                name: 'Thang X. Vu',
                username: 'sinzii',
                email: 'helloworld@email.com',
                password: 'qweqwe123',
            };

            const UserService = require('../../src/services/UserService');
            const newUser = await UserService.create(userDTO);
            assert.isObject(newUser._id);
        });

        it('Create new user without username', async () => {
            const userDTO = {
                name: 'Thang X. Vu',
                email: 'helloworld@email.com',
                password: 'qweqwe123',
            };

            try {
                const UserService = require('../../src/services/UserService');
                await UserService.create(userDTO);
            } catch (e) {
                assert.equal(e.constructor.name, 'InvalidSubmissionData');
                assert.equal(e.message, 'Invalid submission data');
                assert.equal(Object.keys(e.data).length, 1);
            }
        });

        it('Create new user without username and email', async () => {
            const userDTO = {
                name: 'Thang X. Vu',
                password: 'qweqwe123',
            };

            try {
                const UserService = require('../../src/services/UserService');
                await UserService.create(userDTO);
            } catch (e) {
                assert.equal(e.constructor.name, 'InvalidSubmissionData');
                assert.equal(Object.keys(e.data).length, 2);
            }
        });

        it('Create new user without username, email and password', async () => {
            const userDTO = {
                name: 'Thang X. Vu',
            };

            try {
                const UserService = require('../../src/services/UserService');
                await UserService.create(userDTO);
            } catch (e) {
                assert.equal(e.constructor.name, 'InvalidSubmissionData');
                assert.equal(Object.keys(e.data).length, 3);
            }
        });
    });
});
