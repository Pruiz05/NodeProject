const mongoose = require("mongoose");
const Schema = mongoose.Schema;
//base de datos
mongoose.connect("mongodb://localhost:27017/fotos");
//crear schema 
var img_schema = new Schema({
    title: { type: String, required: true }, 
    creator:{type: Schema.Types.ObjectId, ref:"User" },
    extension:{type:String, required:true}
});
//crear modelo
var Image = mongoose.model("Images", img_schema)

module.exports = Image;