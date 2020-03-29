const mongoose = require('mongoose');
const assert = require('chai').assert;

describe('Test UserService', () => {
    beforeEach(async function () {
        const User = mongoose.model('User');
        await User.deleteMany();
    });

    afterEach(async function () {
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

    describe('Update user', () => {
        let newUser;

        beforeEach(async function () {
            const toCreateUserDTO = {
                name: 'Thang X. Vu',
                username: 'sinzii',
                email: 'helloworld@email.com',
                password: 'qweqwe123',
            };

            const UserService = require('../../src/services/UserService');
            newUser = await UserService.create(toCreateUserDTO);
        });

        it('Update user name successful', async () => {
            const toUpdateUserDTO = {
                name: 'Hello World',
            };

            const UserService = require('../../src/services/UserService');
            const updatedUser = await UserService.update(newUser._id, toUpdateUserDTO);
            assert.equal(updatedUser.name, 'Hello World');
        });

        it('Should not update user using the same password', async () => {
            const toUpdateUserDTO = {
                password: 'qweqwe123',
            };

            try {
                const UserService = require('../../src/services/UserService');
                await UserService.update(newUser._id, toUpdateUserDTO);
            } catch (e) {
                assert.equal(e.constructor.name, 'InvalidSubmissionData');
                assert.equal(e.data.password, 'Please use a new password for your security');
                return;
            }

            assert.fail('Should throw InvalidSubmissionData error');
        });

        it('Not found target user to update', async () => {
            try {
                const UserService = require('../../src/services/UserService');
                await UserService.update('123123123', {});
            } catch (e) {
                assert.equal(e.constructor.name, 'ResourceNotFound');
                return;
            }

            assert.fail('Should throw ResourceNotFound error');
        });
    });

    describe('Update password', () => {});

    describe('Hashing password', () => {});

    describe('Check valid password', () => {});

    describe('Activate user', () => {});

    describe('Deactivate user', () => {});

    describe('Find all users', () => {});

    describe('Find one user', () => {});
});
