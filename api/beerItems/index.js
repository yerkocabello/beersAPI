var express = require('express');
var router = express.Router();
var controller = require('./beerItems.controller');

/* GET beers listing. */
router.get('/beers', controller.index);
router.get('/beers/:id', controller.show);

module.exports = router;
