module.exports = {
    HOST: "localhost",
    USER: "postgres",
    PASSWORD: "0000",
    DB: "Logistic1",
    dialect: "postgres",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };