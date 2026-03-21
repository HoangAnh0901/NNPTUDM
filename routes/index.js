const express = require('express');
const router = express.Router();
const invController = require('../controllers/inventoryController');

router.post('/products', invController.createProduct);
router.get('/inventories', invController.getAllInventories);
router.get('/inventories/:id', invController.getInventoryById);
router.post('/add-stock', invController.addStock);
router.post('/remove-stock', invController.removeStock);
router.post('/reservation', invController.reservation);
router.post('/sold', invController.sold);

module.exports = router;