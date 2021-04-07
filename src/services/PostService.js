const validator = require('validator');
const mongoose = require('mongoose');
const Post = mongoose.model('Post');
const PostStatuses = require('../models/domain/Post').PostStatuses;
const ResourceNotFoundError = require('../exceptions/404Error');
const PostValidation = require('../validations/post');
const InvalidSubmissionDataError = require('../exceptions/InvalidSubmissionDataError');
const ActionNotAcceptableError = require('../exceptions/ActionNotAcceptableError');

class PostService {
    async findOne(id, throwError = true) {
        const post = await Post.findById(id);

        if (post) {
            return post;
        }

        if (throwError) {
            throw new ResourceNotFoundError('Post is not existed');
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

        return Post.find(conditions).sort({ 'createdAt': -1 }).limit(limit);
    }

    async create(postDTO) {
        postDTO = await PostValidation.CreatePostValidationSchema.doValidate(postDTO, {
            stripUnknown: true,
            abortEarly: false,
        });

        postDTO.slug = await this.getUniqueSlug(postDTO.slug || postDTO.name);

        const post = new Post(postDTO);
        return await post.save();
    }

    async isNonExistSlug(slug) {
        const existedPosts = await Post.find({ slug }).limit(1);
        return existedPosts.length === 0;
    }

    async getUniqueSlug(slug, suffix = 0) {
        if (!slug) {
            return '';
        }

        slug = slug.trim().toLowerCase().replace(/\s+/gm, '-');

        let slugToSearch = slug;
        const shouldAppendSuffix = suffix > 0;
        if (shouldAppendSuffix) {
            slugToSearch = `${slug}-${suffix}`
        }

        if (await this.isNonExistSlug(slugToSearch)) {
            return slugToSearch;
        } else {
            return this.getUniqueSlug(slug, suffix + 1)
        }
    }

    async update(postId, postDTO) {
        postDTO = await PostValidation.UpdatePostValidationSchema.doValidate(postDTO,  {
            stripUnknown: true,
            abortEarly: false,
        });

        if (Object.keys(postDTO).length === 0) {
            throw new InvalidSubmissionDataError('There is no data to update');
        }

        const targetPost = await this.findOne(postId);

        if (targetPost.name === postDTO.name) {
            delete postDTO.name;
        }

        if (targetPost.slug === postDTO.slug) {
            delete postDTO.slug;
        } else if (postDTO.slug) {
            postDTO.slug = await this.getUniqueSlug(postDTO.slug);
        }

        const hasDataToUpdate = Object.keys(postDTO).length > 0;
        if (hasDataToUpdate) {
            await targetPost.updateOne(
                {
                    $set: postDTO
                },
                {
                    runValidators: true
                }
            );

            return await this.findOne(postId);
        }

        return targetPost;
    }

    async delete(postId) {
        const result = await Post.deleteOne({ _id: postId });

        if (result.deletedCount === 0) {
            throw new ResourceNotFoundError('Post is not existed');
        }
    }

    async publish(postId) {
        const post = await this.findOne(postId);
        if (post.status === 'public') {
            return;
        }

        await post.updateOne(
            {
                $set: {
                    status: 'public'
                }
            },
            {
                runValidators: true
            }
        );
    }

    async officialize(postId, official = true) {
        if (typeof official === 'string') {
            official = validator.toBoolean(official);
        }

        const post = await this.findOne(postId);
        if (post.official === official) {
            return;
        }

        if (official && post.status !== 'public') {
            throw new ActionNotAcceptableError('Could not officialize drafted post');
        }

        await post.updateOne(
            {
                $set: {
                    official
                }
            },
            {
                runValidators: true
            }
        );
    }
}

module.exports = new PostService();
