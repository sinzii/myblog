const validator = require('validator');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const PostStatuses = require('../models/domain/Post').PostStatuses;
const ResourceNotFound = require('../exceptions/404Error');


class PostService {
    async findOne(id, throwError = true) {
        try {
            return await Post.findById(id);
        } catch (e) {
            if (throwError) {
                throw new ResourceNotFound('Post is not existed');
            }
        }

        return null;
    }

    async findAll({ startingAfter, endingBefore, limit = '10', official, status, active = 'true' }) {
        active = validator.toBoolean(active);

        limit = validator.toInt(limit) || 10;
        limit = limit > 100 || limit <= 0 ? 10 : limit;


        let conditions = { active };
        if (startingAfter) {
            conditions._id = {
                $gt: startingAfter,
            };
        } else if (endingBefore) {
            conditions._id = {
                $lt: endingBefore,
            };
        }

        if (official && validator.isBoolean(official)) {
            official = validator.toBoolean(official);
            conditions.official = official;

            if (official) {
                status = 'public';
            }
        }

        if (status && PostStatuses.includes(status)) {
            conditions.status = status;
        }

        console.log(conditions);

        return Post.find(conditions).sort({ 'createdAt': -1 }).limit(limit);
    }

    async create() {

    }

    async update() {

    }


}

module.exports = new PostService();
