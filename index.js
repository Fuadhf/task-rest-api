require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const port = process.env.PORT
const productController = require('./src/product/product.controller');
const userController = require('./src/user/user.controller');
const errorHandler = require('./src/middleware/middleware.error');
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(express.urlencoded({ extended: true }))
app.use(productController, userController, rateLimit({ 
  windowMs: 15*60*1000, max: 5 
}));
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});