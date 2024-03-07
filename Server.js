const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs/promises');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());


const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);


const cartsRouter = require('./routes/carts');
app.use('/api/carts', cartsRouter);


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});