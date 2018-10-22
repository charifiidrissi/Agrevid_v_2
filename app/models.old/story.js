let mongoose = require('mongoose');
 db = require('../db/db');
let Schema = mongoose.Schema;


let StorySchema = new Schema({
    content : String,
    created : {type : Date, defauly: Date.now},
    creator : {type : Schema.Types.ObjectId, ref : 'User'}
});

module.exports = db.model('Story',StorySchema);