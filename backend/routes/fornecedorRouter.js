const express = require('express');
const router = express.Router();
const fornecedorController = require('../controllers/fornecedorController');

router.get('/', fornecedorController.getFornecedores);
router.post('/', fornecedorController.createFornecedor);
router.put('/:id', fornecedorController.updateFornecedor);
router.delete('/:id', fornecedorController.deleteFornecedor);

module.exports = router;
