const db = require('../models');

exports.getFornecedores = async (req, res) => {
  try {
    const fornecedores = await db.Fornecedor.findAll({ include: 'carros' });
    res.status(200).json(fornecedores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createFornecedor = async (req, res) => {
  const { nome, email, telefone } = req.body;
  try {
    const fornecedor = await db.Fornecedor.create({ nome, email, telefone });
    res.status(201).json(fornecedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateFornecedor = async (req, res) => {
  const { nome, email, telefone } = req.body;
  try {
    const fornecedor = await db.Fornecedor.findByPk(req.params.id);
    if (!fornecedor) return res.status(404).json({ error: "Fornecedor não encontrado" });

    await fornecedor.update({ nome, email, telefone });
    res.status(200).json(fornecedor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteFornecedor = async (req, res) => {
  try {
    const fornecedor = await db.Fornecedor.findByPk(req.params.id);
    if (!fornecedor) return res.status(404).json({ error: "Fornecedor não encontrado" });

    const carrosAssociados = await db.Carro.findOne({ where: { fornecedor_id: fornecedor.id } });
    if (carrosAssociados) {
      return res.status(400).json({ error: "Não é possível excluir o fornecedor porque ele está associado a um ou mais veículos." });
    }

    await fornecedor.destroy();
    res.status(200).json({ message: "Fornecedor excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
