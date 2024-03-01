const mongoose = require('mongoose');

const CoWorkSchema = new mongoose. Schema({
name: {
    type: String,
    required: [true, 'Please add a name'],
    unique: true,
    trim: true,
    maxlength: [50, 'Name can not be more than 50 characters']
},

address: {
    type: String,
    required: [true, 'Please add an address']
},

phonenumber: {
    type: String,
    required: [true, 'Please add the telephone number']
},

openclosetime:{
    type: String,
    required: [true, 'Please add the open-closing time'],
    match: [
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]-([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Please add a valid time'
    ]
},

});

module.exports = mongoose.model('CoWork', CoWorkSchema);