'use strict';

import {BeerItem} from '../../models';
import {pagination}  from '../../utils/pagination';
import _ from 'lodash';
var currencyLayer = require('../../integrations/currencyLayer');


function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function (entity) {
        if(entity){
            res.status(statusCode).json(entity);
        }
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        console.log(err)
        res.status(statusCode).send(err);
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if (!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function validateCurrency(currency){
    return currencyLayer.getCurrencyList().then(function (results) {
        var currencyIndex = _.findIndex(Object.keys(results.currencies), function (res) {
           return res === currency;
       });
       return currencyIndex > -1;
    });
}

// Gets a list of BeerItems from the DB
export function index(req, res) {
    return BeerItem.count({
    }).then(function (count) {
        var _pagination = {
            limit: count
        };
        if(req.params.page){
            _pagination = pagination.paginate(req.params.page, count)
        }
        return BeerItem.findAll({
            order:[
                ['name']
            ],
            offset: _pagination.offset,
            limit: _pagination.limit
        }).then(function (result) {
            var resultWrapper = {}
            resultWrapper.entries = result;
            resultWrapper.pagination = _pagination;
            return resultWrapper
        })
            .then(respondWithResult(res))
    .catch(handleError(res));
    });
}

// Gets a single BeerItem from the DB
export function show(req, res) {
    return BeerItem.findOne({
        where: {
            id: req.params.id
        }
    })
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new BeerItem in the DB
export function create(req, res) {
    var beerItem = _.pick(req.body, 'name', 'brewery', 'country', 'price', 'currency');
    validateCurrency(beerItem.currency).then(function (validation) {
        if(validation){
            return BeerItem.create(beerItem)
                .then(respondWithResult(res, 201))
                .catch(handleError(res));
        }else{
            res.status(404)
                .send('Not found');
            return Promise.reject('Currency not found');
        }

    }).then(handleEntityNotFound(res))
        .catch(handleError(res));

}

// Gets the converted price for the beer currency
export function getBoxPrice(req, res) {
    const QTY_PER_BOX = 6;
    return BeerItem.findOne({
       where: {
           id: req.params.id
       }
    }).then(function (beerItem) {
        currencyLayer.getCurrecyPrices(beerItem.currency).then(function (result) {
            var totalPrice = 0;
            _.forEach(result.quotes, function (quote) {
                totalPrice = (quote * QTY_PER_BOX * beerItem.price);
            });
            return { 'total' : totalPrice };
        }).then(respondWithResult(res))
            .catch(handleError(res));
    });
}