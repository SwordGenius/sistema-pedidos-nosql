const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/cliente.controller');

router.get('/', clienteController.index);
router.get('/:id', clienteController.getById);
router.post('/', clienteController.create);
router.patch('/:id', clienteController.updateById);
router.delete('/:id', clienteController.deleteById);
router.put('/:id', clienteController.putById);

module.exports = router;