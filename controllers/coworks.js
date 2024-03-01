const CoWork = require('../models/CoWork');

//@desc Get all
//@route GET /api/v1/coworks
exports.getCoWorks=async(req,res,next) => {
    try{
        const coworks = await CoWork.find();  
        res.status(200).json({success:true, count:coworks.length, data:coworks});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

//@desc Get single
//@route GET /api/v1/coworks/:id
exports.getCoWork=async(req,res,next) => {
    try{
        const cowork = await CoWork.findById(req.params.id); 
        if(!cowork) {
            return res.status(400).json({success:false});
        } 

        res.status(200).json({success:true, data:cowork}); 
    } catch (err) {
        res.status(400).json({success:false});
    }
};


//@desc Create
//@route POST /api/v1/coworks
exports.postCoWorks=async(req,res,next) => {
    //console.log(req.body); shows in VSC terminal
    const cowork = await CoWork.create(req.body);
    res.status(201).json({success:true, data:cowork});

};

//@desc Update
//@route PUT /api/v1/coworks/:id
exports.putCoWork=async(req,res,next) => {
    try{
        const cowork = await CoWork.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators:true
        });
        if(!cowork) {
            return res.status(400).json({success:false});
        } 

        res.status(200).json({success:true, data:cowork});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

//@desc Delete
//@route DELETE /api/v1/coworks
exports.deleteCoWork=async(req,res,next) => {
    try{
        const cowork = await CoWork.findByIdAndDelete(req.params.id); 
        if(!cowork) {
            return res.status(400).json({success:false});
        } 

        res.status(200).json({success:true, data:{}});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

