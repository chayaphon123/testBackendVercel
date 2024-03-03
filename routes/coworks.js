const express = require ('express');
const {getCoWorks, getCoWork, postCoWorks, putCoWork, deleteCoWork} = require ('../controllers/coworks');

const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

//Include other resource routers
const reservationRouter=require('./reservations');

//Re-route into other resource routers
router.use('/:coworkId/reservations', reservationRouter);

router.route('/').get(getCoWorks).post(protect,authorize('admin'),postCoWorks);
router.route('/:id').get(getCoWork).put(protect,authorize('admin'),putCoWork).delete(protect,authorize('admin'),deleteCoWork);

module.exports=router;
