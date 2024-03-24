/**
* @swagger
* components:
*   schemas:
*     CoWork:
*       type: object
*       required:
*         - name
*         - address
*         - phonenumber
*         - openclosetime
*         - picture
*       properties:
*         name:
*           type: string
*           description: Name of the co-working space
*         address:
*           type: string
*           description: Address of the co-working space
*         phonenumber:
*           type: string
*           description: Phone number of co-working space
*         openclosetime:
*           type: string
*           description: Open-Close time of co-working space
*         picture:
*           type: string
*           description: Picture of the co-working space
*/


const express = require ('express');
const {getCoWorks, getCoWork, postCoWorks, putCoWork, deleteCoWork} = require ('../controllers/coworks');

/**
* @swagger
* tags:
*   name: CoWork
*   description: The co-working spaces managing API
*/

const router = express.Router();

const {protect,authorize} = require('../middleware/auth');

//Include other resource routers
const reservationRouter=require('./reservations');

//Re-route into other resource routers

/**
* @swagger
* /coworks:
*   post:
*     security:
*       - bearerAuth: []
*     summary: Create a new co-working space
*     tags: [CoWork]
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CoWork'
*     responses:
*       201:
*         description: The co-working sapce was successfully created
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/CoWork'
*       500:
*         description: Some server error
*/

/**
* @swagger
* /coworks:
*   get:
*     summary: Returns the list of all the co-working spaces
*     tags: [CoWork]
*     responses:
*       200:
*         description: The list of the co-working space
*         content:
*           application/json:
*             schema:
*               type: array
*               items:
*               $ref: '#/components/schemas/CoWork'
*/
router.use('/:coworkId/reservations', reservationRouter);
router.route('/').get(getCoWorks).post(protect,authorize('admin'),postCoWorks);

/**
* @swagger
* /coworks/{id}:
*   get:
*     summary: Get the co-working space by id
*     tags: [CoWork]
*     parameters:
*       - in: path
*         name: id
*         schema:
*           type: string
*         required: true
*         description: The co-working space id
*     responses:
*       200:
*         description: The co-working space description by id
*         contents:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/CoWork'
*       404:
*         description: The co-working space was not found
*/
router.route('/:id').get(getCoWork).put(protect,authorize('admin'),putCoWork).delete(protect,authorize('admin'),deleteCoWork);

module.exports=router;
