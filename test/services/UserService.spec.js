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
                assert.equal(e.constructor.name, 'InvalidSubmissionDataError');
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
                assert.equal(e.constructor.name, 'InvalidSubmissionDataError');
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
                assert.equal(e.constructor.name, 'InvalidSubmissionDataError');
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
                assert.equal(e.constructor.name, 'InvalidSubmissionDataError');
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
                assert.equal(e.constructor.name, 'ResourceNotFoundError');
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

    describe('Find all users', () => {
        beforeEach(async function () {
            const toCreateUserDTOs = [
                {
                    name: 'Thang X. Vu',
                    username: 'thangxv',
                    email: 'thangxv@email.com',
                    password: 'qweqwe123',
                },
                {
                    name: 'Thomas V',
                    username: 'thomasv',
                    email: 'thomasv@email.com',
                    password: 'a_secret_password',
                },
                {
                    name: 'Hello World',
                    username: 'helloworld',
                    email: 'helloworld@email.com',
                    password: 'helloword_password',
                },
            ];

            const UserService = require('../../src/services/UserService');
            for (const one of toCreateUserDTOs) {
                await UserService.create(one);
            }
        });

        it('Find all user in the first page', async function () {
            const UserService = require('../../src/services/UserService');
            const users = await UserService.findAll();
            assert.equal(users.length, 3);
        });

        it('Find all user with offset and limit', async function () {
            const UserService = require('../../src/services/UserService');
            let users = await UserService.findAll('', 0, 2);
            assert.equal(users.length, 2);
            assert.equal(users[0].username, 'helloworld');

            users = await UserService.findAll('', 1, 1);
            assert.equal(users.length, 1);
            assert.equal(users[0].username, 'thomasv');
        });

        it('Find by search text by username', async function () {
            const UserService = require('../../src/services/UserService');
            const users = await UserService.findAll('thangxv');
            assert.equal(users.length, 1);
        });

        it('Find by search text by name', async function () {
            const UserService = require('../../src/services/UserService');
            const users = await UserService.findAll('Thang X.');
            assert.equal(users.length, 1);
            assert.equal(users[0].name, 'Thang X. Vu');
        });

        it('Find by search text by email', async function () {
            const UserService = require('../../src/services/UserService');
            const users = await UserService.findAll('helloworld@email.com');
            assert.equal(users.length, 1);
            assert.equal(users[0].name, 'Hello World');
        });
    });

    describe('Find one user', () => {});
});
