'use strict';
const sinon = require('sinon');
var proxyquire = require('proxyquire').noPreserveCache();
const app = require('../../../start');
var expect = require('chai').expect;
var chai = require('chai');
chai.use(require('sinon-chai'));

var answerProviderCtrlStub = {
    index: 'beerItemCtrl.index',
    show: 'beerItemCtrl.show',
    create: 'beerItemCtrl.create',
    getBoxPrice: 'beerItemCtrl.getBoxPrice'
};

var routerStub = {
    get: sinon.spy(),
    post: sinon.spy()
};

// require the index with our stubbed out modules
var answerProviderIndex = proxyquire('../../../src/api/beerItems/index.js', {
    'express': {
        Router: function() {
            return routerStub;
        }
    },
    './beerItems.controller': answerProviderCtrlStub
});

describe('BeerItem API Router:', function () {
    it('should return an express router instance', function() {
        expect(answerProviderIndex).to.equal(routerStub);
    });

    describe('GET /beers', function() {

        it('should route to beerItem.controller.index', function() {
            expect(routerStub.get
                .withArgs('/beers', 'beerItemCtrl.index')
            ).to.have.been.called;
        });
    });

    describe('GET /beers/:id', function() {

        it('should route to beerItem.controller.show', function() {
            expect(routerStub.get
                .withArgs('/beers/:id', 'beerItemCtrl.show')
            ).to.have.been.called;
        });
    });

    describe('GET /beers/:id/boxprice', function() {

        it('should route to beerItem.controller.getBoxPrice', function() {
            expect(routerStub.get
                .withArgs('/beers/:id/boxprice', 'beerItemCtrl.getBoxPrice')
            ).to.have.been.called;
        });
    });

    describe('POST /beers', function() {

        it('should route to beerItem.controller.create', function() {
            expect(routerStub.post
                .withArgs('/beers', 'beerItemCtrl.create')
            ).to.have.been.called;
        });
    });
});

/*var request = require('supertest');
const chai = require("chai");
const chaiHttp = require('chai-http');
const app = require('../../../start');
chai.use(chaiHttp);
chai.should();

describe('/beers', function () {
    it('should get a status 200', function() {
        chai.request(app)
            .get('/beers')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                if (err) throw err;
            });
    });
});

describe('/beers/:id', function () {
    it('should get a status 200', function() {
        chai.request(app)
            .get('/beers/1')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                if (err) throw err;
            });
    });
});

describe('/beers/:id', function () {
    it('should get a status 200', function() {
        chai.request(app)
            .get('/beers/1')
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.be.a('object');
                if (err) throw err;
            });
    });
});*/


