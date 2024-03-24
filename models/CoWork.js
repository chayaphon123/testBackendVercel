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

opentime:{
    type: String,
    required: [true, 'Please add the open time'],
    match: [
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Please add a valid time'
    ]
},

closetime:{
    type: String,
    required: [true, 'Please add the close time'],
    match: [
        /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
        'Please add a valid time'
    ]
},

price: {
    type: Number,
    required: [true, 'Please add the price']
},

picture:{
    type: String,
    required: [true, 'Please add a picture']
},

},
{
    toJSON: {virtuals:true},
    toObject: {virtuals:true}
});

//Reverse populate with virtuals
CoWorkSchema.virtual('reservations', {
    ref: 'Reservation',
    localField: '_id',
    foreignField: 'cowork',
    justOne: false
});

//Cascade delete reservations when a co-work room is deleted
CoWorkSchema.pre('deleteOne', {document:true, query: false}, async function(next){
    console.log(`Reservations being removed from co-work room ${this._id}`);
    await this.model('Reservation').deleteMany({cowork:this._id});
    next();
});

module.exports = mongoose.model('CoWork', CoWorkSchema);