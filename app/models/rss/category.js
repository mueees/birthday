var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
    feeds_id: []
});

var Category = mongoose.model('Category', categorySchema);

module.exports = Category;