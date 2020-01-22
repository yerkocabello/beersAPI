'use strict';

var rp = require('request-promise');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
const CURRENCY_LAYER_API = config.currencyLayer;

export function getCurrecyPrices(currency){
    var options = {
        method: 'GET',
        uri: CURRENCY_LAYER_API.url + '/live?access_key=' + CURRENCY_LAYER_API.apiKey + '&currencies=' + currency,
        json: true
    };
    return rp(options)
        .then(function (result) {
            return result;
        }).catch(function(err){
            console.log(err.stack)
            return Promise.reject(err)
        });
}