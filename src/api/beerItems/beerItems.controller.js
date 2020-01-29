'use strict';

import {BeerItem} from '../../models';
import {pagination}  from '../../utils/pagination';
import _ from 'lodash';
var currencyLayer = require('../../integrations/currencyLayer');


function respondWithResult(res, statusCode, entity) {
    statusCode = statusCode || 200;
    if(!_.isNil(entity)){
        res.status(statusCode).json(entity);
    }else{
        res.status(404).end();
    }
}

function handleError(res, statusCode, err) {
    statusCode = statusCode || 500;
    res.status(statusCode).send(err);
}

async function validateCurrency(currency){
    if(_.isNil(currency)) return Promise.resolve(true);
    var results = await currencyLayer.getCurrencyList();
    var currencyIndex = _.findIndex(Object.keys(results.currencies), function (res) {
        return res === currency;
    });
    return Promise.resolve(currencyIndex > -1);
}

// Gets a list of BeerItems from the DB
export async function index(req, res) {
    var resultWrapper = {};
    try{
        var count = await BeerItem.count({});
        var _pagination = {
            limit: count
        };
        if(req.params.page){
            _pagination = pagination.paginate(req.params.page, count);
        }
        var results = await BeerItem.findAll({
            order:[
                ['name']
            ],
            offset: _pagination.offset,
            limit: _pagination.limit
        });
        resultWrapper.entries = results;
        resultWrapper.pagination = _pagination;
        if(resultWrapper.entries.length > 0){
            return respondWithResult(res, 200, resultWrapper);
        }else {
            return respondWithResult(res, 204, resultWrapper);
        }

    }catch (e) {
        return handleError(res, 500, e);
    }
}

// Gets a single BeerItem from the DB
export async function show(req, res) {
    var result = {};
    try{
        result = await BeerItem.findByPk(req.params.id);
        respondWithResult(res, 200, result);
    }catch(e){
        return handleError(res, 500, e);
    }
}

// Creates a new BeerItem in the DB
export async function create(req, res) {
    var beerItem = _.pick(req.body, 'name', 'brewery', 'country', 'price', 'currency');
    var validation = await validateCurrency(beerItem.currency);
    var createdBeerItem;
    if(validation){
        try{
            createdBeerItem = await BeerItem.create(beerItem);
        }catch (e) {
            return handleError(res, 500, e);
        }
    }
    return respondWithResult(res, 201, createdBeerItem);
}

// Gets the converted price for the beer currency
export async function getBoxPrice(req, res) {
    const QTY_PER_BOX = 6;
    try{
        var beerItem = await BeerItem.findByPk(req.params.id);
        var result = await currencyLayer.getCurrecyPrices(beerItem.currency);
        var totalPrice = 0;
        _.forEach(result.quotes, function (quote) {
            totalPrice = (quote * QTY_PER_BOX * beerItem.price);
        });
        var result = { 'total' : totalPrice };
        return respondWithResult(res, 200, result);
    }catch(e){
       return handleError(res, 500, e);
    }
}

//Updates a beerItem in the DB
export async function update(req, res) {
    var currency = req.body.currency ? req.body.currency : null;
    try {
        var validation = await validateCurrency(currency);
        var updatedItem;
        if(validation){
            var itemToUpdate = await BeerItem.findOne({ where: { id: req.params.id } });
            var _updates = _.pick(req.body, 'name', 'brewery', 'country', 'price', 'currency');
            updatedItem = await itemToUpdate.update(_updates);
        }
        return respondWithResult(res, 200, updatedItem);
    }catch(e){
        return handleError(res, 500, e);
    }
}

/* Removes a record from the DB */
export async function destroy(req, res) {
    var result = {};
    try{
        result = await BeerItem.destroy({
            where: {id: req.params.id}
        });
        return respondWithResult(res, 200, result);
    }catch(e){
        return handleError(res, 500, e);
    }
} 