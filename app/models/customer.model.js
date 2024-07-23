module.exports = (sequelize, Sequelize) => {
    const Customer = sequelize.define ("customers", {
        firstname: {
            type: Sequelize.STRING
        },
        lastname:{
            type: Sequelize.STRING
        },
        address: {
            type: Sequelize.STRING
        },
        phone: {
            type: Sequelize.STRING
        },
        email: {
            type: Sequelize.STRING
        },
        billingAddress: {
            type: Sequelize.STRING
        }
    })

    return Customer;
}