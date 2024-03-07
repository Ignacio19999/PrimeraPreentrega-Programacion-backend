const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const PRODUCTS_FILE = 'productos.json';

router.get('/', async (req, res) => {
  try {
    const limit = req.query.limit || 10;
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data).slice(0, limit);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const product = JSON.parse(data).find((p) => p.id == pid);
    if (!product) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const newProduct = {
    id: uuidv4(), 
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);
    products.push(newProduct);
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const updatedProduct = req.body;

  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);
    const index = products.findIndex((p) => p.id == pid);

    if (index === -1) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      products[index] = { ...products[index], ...updatedProduct };
      await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2));
      res.json(products[index]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf-8');
    const products = JSON.parse(data);
    const filteredProducts = products.filter((p) => p.id != pid);

    if (filteredProducts.length === products.length) {
      res.status(404).json({ error: 'Producto no encontrado' });
    } else {
      await fs.writeFile(PRODUCTS_FILE, JSON.stringify(filteredProducts, null, 2));
      res.json({ message: 'El producto fue eliminado correctamente' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;