'use strict';
const app = require('../../../start');
var controller = require('../../../src/api/beerItems/beerItems.controller');
var expect = require('chai').expect;
const sinon = require('sinon');
const sinonTest = require('sinon-test');
var test = sinonTest(sinon);
const {BeerItem} = require ('../../../src/models');
const pagination = require('../../../src/utils/pagination');
var currencyLayer = require('../../../src/integrations/currencyLayer');
var chai = require('chai');
chai.use(require('sinon-chai'));

var beerItems = {
    entries: [
        {
            id: 2,
            name: 'Golden',
            brewery: 'Kross',
            country: 'USA',
            price: 10.2,
            currency: 'CLP',
            createdAt: '2020-01-22T17:22:16.000Z',
            updatedAt: '2020-01-22T17:22:16.000Z'
        },
        {
            id: 3,
            name: 'Golden',
            brewery: 'Kross',
            country: 'USA',
            price: 10.2,
            currency: 'ASDSADS',
            createdAt: '2020-01-22T19:50:32.000Z',
            updatedAt: '2020-01-22T19:50:32.000Z'
        }
    ],
    pagination: {
        limit: 2
    }
};

var beerItemToUpdate = {
    id: 2,
    name: 'Golden',
    brewery: 'Kross',
    country: 'USA',
    price: 10.2,
    currency: 'CLP',
    createdAt: '2020-01-22T17:22:16.000Z',
    updatedAt: '2020-01-22T17:22:16.000Z',
    update: sinon.stub().returns(Promise.resolve())
};

var currencies = {
    success: true,
    terms: 'https://currencylayer.com/terms',
    privacy: 'https://currencylayer.com/privacy',
    currencies: {
        CLP: 'Chilean Peso'
    }
};

var currencyPrices = {
    success: true,
        terms: 'https://currencylayer.com/terms',
        privacy: 'https://currencylayer.com/privacy',
        timestamp: 1579709346,
        source: 'USD',
        quotes: {
        USDCLP: 771.499323
    }
};

var count = sinon.stub(BeerItem, 'count').returns(Promise.resolve(2));
var findAll = sinon.stub(BeerItem, 'findAll').returns(Promise.resolve(beerItems));
var page = sinon.stub(pagination, 'paginate').returns({offset: 1, limit: 2, total_pages: 1, current_page: 1, total_items: 2});
var findByPk = sinon.stub(BeerItem, 'findByPk').returns(Promise.resolve(beerItems.entries[0]));
var findOne = sinon.stub(BeerItem, 'findOne').returns(Promise.resolve(beerItemToUpdate));
var create = sinon.stub(BeerItem, 'create').returns(Promise.resolve());
var update = sinon.stub(BeerItem, 'update').returns(Promise.resolve());
var destroy = sinon.stub(BeerItem, 'destroy').returns(Promise.resolve());
var getCurrencyList = sinon.stub(currencyLayer, 'getCurrencyList').returns(Promise.resolve(currencies));
var getCurrencyPrices = sinon.stub(currencyLayer, 'getCurrecyPrices').returns(Promise.resolve(currencyPrices));

describe('get', function () {
    var res, expectedResult, req;
    beforeEach(function () {
        res = {
            json: sinon.spy(),
            status: sinon.stub().returns({ json: sinon.stub().returns({}), end: sinon.stub().returns({}), send: sinon.stub().returns({}) })
        };
        req = { params: {id: 2}};
    });
    it('should return a list with beerItems', test(function () {
        controller.index(req, res).then(function (result) {
            expect(count.calledOnce).to.be.true;
            expect(findAll.calledOnce).to.be.true;
        });
    }));

    it('should return a single beerItem', test(function () {
        controller.show(req, res).then(function (result) {
            expect(findByPk.calledOnce).to.be.true;
        });
    }));

    it('should return box price > 0 ', test(function () {
        controller.getBoxPrice(req, res).then(function (result) {
            expect(getCurrencyPrices.calledOnce).to.be.true;
        });
    }));

    it('should not create a beerItem', test(function () {
        var beerItem = {
            name: 'Golden',
            brewery: 'Kross',
            country: 'USA',
            price: 10.2,
            currency: 'AsSDSD'
        };
        req.body = beerItem;
        controller.create(req, res).then(function (result) {
            expect(create.calledOnce).to.be.false;
        });
    }));

    it('should create a beerItem', test(function () {
        var beerItem = {
            name: 'Golden',
            brewery: 'Kross',
            country: 'USA',
            price: 10.2,
            currency: 'CLP'
        };
        req.body = beerItem;
        controller.create(req, res).then(function (result) {
            expect(create.calledOnce).to.be.true;
        });
    }));

    it('should update a beerItem', test(function () {
        var beerItem = {
            name: 'GoLdEn',
            brewery: 'KrOsS',
            country: 'USA',
            price: 10.2,
            currency: 'CLP'
        };
        req.body = beerItem;
        controller.update(req, res).then(function (result) {
            expect(findOne.calledOnce).to.be.true;
            //expect(update.calledOnce).to.be.true;
        });
    }));

    it('should delete a beerItem', test(function () {
        req.params.id = 3;
        controller.destroy(req, res).then(function (result) {
            expect(destroy.calledOnce).to.be.true;
        });
    }));
});