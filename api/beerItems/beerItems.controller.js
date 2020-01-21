'use strict';

import {BeerItem} from '../../models';
import {pagination}  from '../../utils/pagination';


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

// Gets a single Brand from the DB
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