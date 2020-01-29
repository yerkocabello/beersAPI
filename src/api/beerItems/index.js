var express = require('express');
var router = express.Router();
var controller = require('./beerItems.controller');

/* Endpoints for beerItems. */

/* Lists all the beers found in the system */
router.get('/beers', controller.index);

/* Lists the details of a specific beer. */
router.get('/beers/:id', controller.show);

/* Creates a new beer. */
router.post('/beers', controller.create);

/* Updates an existing beer. */
router.put('/beers/:id', controller.update);

/* Deletes a beerItem from the DB*/
router.delete('/beers/:id', controller.destroy);

/* Gets the value of a specific beer box */
router.get('/beers/:id/boxprice', controller.getBoxPrice);


module.exports = router;
