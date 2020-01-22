var express = require('express');
var router = express.Router();
var controller = require('./beerItems.controller');

/* Endpoints for beerItems. */
router.get('/beers', controller.index);
router.get('/beers/:id', controller.show);
router.post('/beers', controller.create);
router.get('/beers/:id/boxprice', controller.getConvertedPriceForBox);

module.exports = router;
