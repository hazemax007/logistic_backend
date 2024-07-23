const express = require("express")
const cors = require("cors")
const productRoutes = require('./app/routes/product.routes')
const storeRoutes = require('./app/routes/store.routes')
const customerRoutes = require('./app/routes/customer.routes')
const supplierRoutes = require('./app/routes/supplier.routes')
const orderRoutes = require('./app/routes/order.routes')
const communicationRoutes = require('./app/routes/communication.routes')
const dashboardRoutes = require('./app/routes/dash.routes')
const path = require('path')




const app = express();

const corsOptions = {
  origin: 'http://localhost:3000', // Replace with your frontend's origin
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());


app.use(express.urlencoded({ extended: true }));







const db = require("./app/models");
//const Role = db.role;

db.sequelize.sync({ alter: true })
  .then(() => {
    console.log("Sequelize models synchronized with the database");
  })
  .catch(err => {
    console.error("Error synchronizing Sequelize models:", err);
  });

/*db.sequelize.sync({force: true}).then(() => {
  console.log('Drop and Resync Database with { force: true }');
  initial();
})*/


app.get("/", (req, res) => {
  res.json({ message: "Welcome to our application." });
});


require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);
app.use('/api/products', productRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/communications', communicationRoutes);
app.use('/api/dash', dashboardRoutes);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the public directory
app.use('/invoices', express.static(path.join(__dirname, 'invoices')));


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

/*function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "manager"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}*/
