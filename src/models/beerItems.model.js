'use strict';
module.exports = (sequelize, DataTypes) => {
    const BeerItem = sequelize.define('BeerItem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            allowNull: false,
            type: DataTypes.STRING(45),
        },
        brewery: {
            allowNull: false,
            type: DataTypes.STRING(45),
        },
        country: {
            allowNull: false,
            type: DataTypes.STRING(45),
        },
        price: {
            allowNull: false,
            type: DataTypes.DOUBLE,
        },
        currency: {
            allowNull: false,
            type: DataTypes.STRING(45),
        }
    }, {});
    BeerItem.associate = function(models) {
        // associations can be defined here
    };
    return BeerItem;
};