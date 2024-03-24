const Reservation = require('../models/Reservation');
const CoWork = require('../models/CoWork');

//@desc Get all reservation
//@route GET /api/v1/reservations
//@access Private
exports.getReservations=async (req,res,next)=>{
    let query;
    //General users can see only their reservation!
    if(req.user.role !== 'admin'){
        query=Reservation.find({user:req.user.id}).populate({
            path: 'cowork',
            select: 'name address phonenumber opentime closetime price picture'
        });
    } else {
        if(req.params.coworkId){
            console.log(req.params.coworkId);
            query=Reservation.find({cowork: req.params.coworkId}).populate({
                path: 'cowork',
                select: 'name address phonenumber opentime closetime price picture'
            });
        } else {
            query=Reservation.find().populate({
                path: 'cowork',
                select: 'name address phonenumber opentime closetime price picture'
            });
        }
        
    }
    try{
        const reservations=await query;

        res.status(200).json({
            success: true,
            count: reservations.length,
            data: reservations
        });

    } catch(err){
        console.log(err.stack);
        return res.status(500).json({
            success: false,
            message: 'Cannot find Reservation'
        });
    }
};

//@desc Get single reservation
//@route GET /api/v1/reservations/:id
//@access Public
exports.getReservation=async (req,res,next)=>{
    try{
        const reservation= await Reservation.findById(req.params.id).populate({
            path: 'cowork',
            select: 'name address phonenumber opentime closetime price picture'
        });

        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success:true,
            data: reservation
        });
    } catch(err){
        console.log(err.stack);
        return res.status(500).json({success:false,message:"Cannot find Reservation"});
    }
};

//@desc Add single reservation
//@route POST /api/v1/coworks/:coworkId/reservations
//@access Private
exports.addReservation=async (req,res,next)=>{
    try{
        req.body.cowork=req.params.coworkId;

        const cowork= await CoWork.findById(req.params.coworkId);

        if(!cowork){
            return res.status(404).json({
                success:false,
                message:`No co-work room with the id of ${req.params.coworkId}`
            });
        }

        //add user Id to req.body
        req.body.user = req.user.id;
        //Check for existed reservation
        const existedReserves = await Reservation.find({user:req.user.id});
        //If the user is not an admin, they can only create 3 reservations
        if(existedReserves.length >= 3 && req.user.role !== 'admin'){
            return res.status(400).json({success:false,message:`The user with ID ${req.user.id} has already made 3 reservations`});
        }

        const reservation = await Reservation.create(req.body);

        res.status(200).json({
            success:true,
            data:reservation
        });
        
    } catch(err){
        console.log(err);

        return res.status(500).json({
            success:false, 
            message:"Cannot create Reservation"
        });
    }
};

//@desc Update reservation
//@route PUT /api/v1/reservations/:id
//@access Private
exports.updateReservation=async (req,res,next)=>{
    try{
        let reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({success:false,message:`No reservation with the id of ${req.params.id}`});
        }

        //Make sure user is the reservation owner
        if(reservation.user.toString()!==req.user.id && req.user.role!=='admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to update this reservation`});
        }

        reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        });

        res.status(200).json({
            success:true,
            data: reservation
        });
    } catch(err){
        console.log(err.stack);

        return res.status(500).json({success:false,message:'Cannot update Reservation'});
    }
};

//@desc Delete reservation
//@route DELETE /api/v1/reservations/:id
//@access Private
exports.deleteReservation=async (req,res,next)=>{
    try{
        const reservation = await Reservation.findById(req.params.id);

        if(!reservation){
            return res.status(404).json({
                success:false,
                message:`No reservation with the id of ${req.params.id}`
            });
        }

        //Make sure user is the appointment owner
        if(reservation.user.toString()!==req.user.id && req.user.role!=='admin'){
            return res.status(401).json({success:false,message:`User ${req.user.id} is not authorized to delete this reservation`});
        }

        await reservation.deleteOne();

        res.status(200).json({
            success:true,
            data: {}
        });
    } catch(err){
        console.log(err);
        return res.status(500).json({success:false, message:"Cannot delete Reservation"});
    }
};