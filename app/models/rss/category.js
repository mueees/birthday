var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categorySchema = new Schema({
    name: String,
    feeds: []
});

var Category = mongoose.model('Rss_category', categorySchema);

module.exports = Category;