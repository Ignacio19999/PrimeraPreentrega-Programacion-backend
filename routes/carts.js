const express = require('express');
const router = express.Router();
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const CARTS_FILE = 'carrito.json';

router.post('/', async (req, res) => {
  const newCart = {
    id: uuidv4 ,
    products: [],
  };

  try {
    const data = await fs.readFile(CARTS_FILE, 'utf-8');
    const carts = JSON.parse(data);
    carts.push(newCart);
    await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Error Interno del Servidor' });
  }
});

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;

  try {
    const data = await fs.readFile(CARTS_FILE, 'utf-8');
    const carts = JSON.parse(data);
    const cart = carts.find((c) => c.id == cid);

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      res.json(cart.products);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error Interno del Servidor' });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const data = await fs.readFile(CARTS_FILE, 'utf-8');
    const carts = JSON.parse(data);
    const cartIndex = carts.findIndex((c) => c.id == cid);

    if (cartIndex === -1) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    } else {
      const productIndex = carts[cartIndex].products.findIndex((p) => p.id == pid);

      if (productIndex === -1) {
        carts[cartIndex].products.push({ id: pid, quantity });
      } else {
        carts[cartIndex].products[productIndex].quantity += quantity;
      }

      await fs.writeFile(CARTS_FILE, JSON.stringify(carts, null, 2));
      res.status(201).json(carts[cartIndex]);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error Interno del Servidor' });
  }
});

module.exports = router;