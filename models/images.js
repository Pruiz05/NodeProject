const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect("mongodb://localhost:27017/fotos");

var img_schema = new Schema({
    title: { type: String, required: true }
});

var Image = mongoose.model("Images", img_schema)

module.exports = Image;