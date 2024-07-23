module.exports = (sequelize, Sequelize) => {
    const Label = sequelize.define("labels", {
        ref: {
            type: Sequelize.STRING,
            unique: true
        },
        type: {
            type: Sequelize.STRING
        },
        weight: {
            type: Sequelize.FLOAT
        },
        adresse: {
            type: Sequelize.STRING
        },
    });

    return Label;
};