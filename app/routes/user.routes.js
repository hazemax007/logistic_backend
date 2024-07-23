const authJwt  = require("../middlewares/authJwt");
const controller = require("../controllers/user.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/test/all", controller.allAccess);

  app.get(
    "/api/test/paymaster",
    [authJwt.verifyToken, authJwt.isPaymaster],
    controller.paymasterBoard
  );

  app.get(
    "/api/test/manager",
    [authJwt.verifyToken, authJwt.isManager],
    controller.managerBoard
  );

  app.get(
    "/api/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  app.post('/api/test/users', authJwt.verifyToken, authJwt.isAdmin, controller.createUser);

  app.get("/api/test/users", controller.getAllUsers);

  app.get("/api/test/users/:id", controller.getUserById);

  app.put("/api/test/users/:id", controller.updateUser);

  app.delete("/api/test/users/:id", controller.deleteUser);

  app.post('/api/test/users/:userId/roles', authJwt.verifyToken, authJwt.isAdmin, controller.addUserRole);

  //app.put('/api/test/users/:userId/roles/:roleId', authJwt.verifyToken, authJwt.isAdmin, controller.updateUserRole);

  app.delete('/api/test/users/:userId/roles/:roleId', authJwt.verifyToken, authJwt.isAdmin, controller.deleteUserRole);

  app.put("/api/users/:id/status", authJwt.verifyToken, authJwt.isAdmin, controller.toggleUserStatus);

  app.post('/api/test/users/block/:id', controller.blockUser);

  app.post('/api/test/users/unblock/:id',controller.unblockUser);
};