const express = require ('express');
const {getCoWorks, getCoWork, postCoWorks, putCoWork, deleteCoWork} = require ('../controllers/coworks');

const router = express.Router();

router.route('/').get(getCoWorks).post(postCoWorks);
router.route('/:id').get(getCoWork).put(putCoWork).delete(deleteCoWork);

module.exports=router;
