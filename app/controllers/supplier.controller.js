const db = require('../models');
const Supplier = db.supplier;
const User = db.user

// Create and Save a new Supplier for a specific User
exports.create = async (req, res) => {
  const userId = req.params.userId;

  // Validate request
  if (!req.body.name || !req.body.phone || !req.body.email) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  try {
    // Check if user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({
        message: `User with id=${userId} not found.`
      });
    }

    // Create a Supplier
    const supplier = {
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      location: req.body.location,
      paymentTerms: req.body.paymentTerms,
      deliveryTerms: req.body.deliveryTerms,
      specialAgreements: req.body.specialAgreements,
      userId: userId
    };

    // Save Supplier in the database
    const data = await Supplier.create(supplier);
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Supplier."
    });
  }
};

exports.findAll = (req, res) => {
  const userId = req.params.userId;

  Supplier.findAll()
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving suppliers."
      });
    });
};


exports.findAllForUser = (req, res) => {
  const userId = req.params.userId;

  Supplier.findAll({
    where: { userId: userId },
    include: ["user"]
  })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving suppliers."
      });
    });
};

// Find a single Supplier with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Supplier.findByPk(id, { include: ["user"] })
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Supplier with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Supplier with id=" + id
      });
    });
};

// Update a Supplier by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Supplier.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Supplier was updated successfully."
        });
      } else {
        res.send({
          message: `Cannot update Supplier with id=${id}. Maybe Supplier was not found or req.body is empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating Supplier with id=" + id
      });
    });
};

// Delete a Supplier with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Supplier.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Supplier was deleted successfully!"
        });
      } else {
        res.send({
          message: `Cannot delete Supplier with id=${id}. Maybe Supplier was not found!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Supplier with id=" + id
      });
    });
};