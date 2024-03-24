const mongoose=require('mongoose');

const ReservationSchema=new mongoose.Schema({
    resvDate: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    cowork: {
        type: mongoose.Schema.ObjectId,
        ref: 'CoWork',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    picture:{
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports=mongoose.model('Reservation', ReservationSchema);