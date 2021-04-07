const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

function isValidId(idStr) {
    return ObjectId.isValid(idStr);
}

module.exports = {
    isValidId
}
