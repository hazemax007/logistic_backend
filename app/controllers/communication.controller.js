const nodemailer = require('nodemailer');
const db = require("../models");
const Communication = db.communication;
const Supplier = db.supplier;
const User = db.user;

const sendEmail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
      service: 'gmail', // Use your email service
      auth: {
        user: 'hazembensalem77@gmail.com',
        pass: 'efcrbuwgbygwxcvs'
      }
    });
  
    let mailOptions = {
      from: 'hazembensalem77@gmail.com',
      to: to,
      subject: subject,
      text: text
    };
  
    await transporter.sendMail(mailOptions);
  };

  // Send email and log communication
exports.sendEmailAndLog = async (req, res) => {
    const userId = req.params.userId;
    const supplierId = req.params.supplierId;
    const subject = req.body.subject;
    const text = req.body.text;
  
    // Validate request
    if (!userId || !supplierId || !subject || !text) {
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
  
      // Check if supplier exists
      const supplier = await Supplier.findByPk(supplierId);
      if (!supplier) {
        return res.status(404).send({
          message: `Supplier with id=${supplierId} not found.`
        });
      }
  
      // Send email
      await sendEmail(supplier.email, subject, text);
  
      // Log communication
      const communication = {
        type: 'Email',
        date: new Date(),
        notes: text,
        userId: userId,
        supplierId: supplierId
      };
  
      const data = await Communication.create(communication);
      res.send(data);
    } catch (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while sending the email and logging the communication."
      });
    }
  };
  
  // Retrieve all Communications for a specific Supplier
  exports.findAllForSupplier = (req, res) => {
    const supplierId = req.params.supplierId;
  
    Communication.findAll({
      where: { supplierId: supplierId },
      include: ["supplier", "user"]
    })
      .then(data => {
        res.send(data);
      })
      .catch(err => {
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving communications."
        });
      });
  };
  
  // Find a single Communication with an id
  exports.findOne = (req, res) => {
    const id = req.params.id;
  
    Communication.findByPk(id, { include: ["supplier", "user"] })
      .then(data => {
        if (data) {
          res.send(data);
        } else {
          res.status(404).send({
            message: `Cannot find Communication with id=${id}.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error retrieving Communication with id=" + id
        });
      });
  };
  
  // Update a Communication by the id in the request
  exports.update = (req, res) => {
    const id = req.params.id;
  
    Communication.update(req.body, {
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Communication was updated successfully."
          });
        } else {
          res.send({
            message: `Cannot update Communication with id=${id}. Maybe Communication was not found or req.body is empty!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating Communication with id=" + id
        });
      });
  };
  
  // Delete a Communication with the specified id in the request
  exports.delete = (req, res) => {
    const id = req.params.id;
  
    Communication.destroy({
      where: { id: id }
    })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Communication was deleted successfully!"
          });
        } else {
          res.send({
            message: `Cannot delete Communication with id=${id}. Maybe Communication was not found!`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Could not delete Communication with id=" + id
        });
      });
  };