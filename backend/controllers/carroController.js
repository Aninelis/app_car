const db = require('../models');

exports.getCarros = async (req, res) => {
  try {
    const carros = await db.Carro.findAll({ include: 'fornecedor' });
    res.status(200).json(carros);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCarro = async (req, res) => {
  const { marca, modelo, ano, fornecedor_id, quantidade } = req.body;
  try {
    const fornecedor = await db.Fornecedor.findByPk(fornecedor_id);
    if (!fornecedor) return res.status(404).json({ error: "Fornecedor não encontrado" });

    const carro = await db.Carro.create({ marca, modelo, ano, fornecedor_id, quantidade });
    res.status(201).json(carro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCarro = async (req, res) => {
  const { marca, modelo, ano, fornecedor_id, quantidade } = req.body;
  try {
    const carro = await db.Carro.findByPk(req.params.id);
    if (!carro) return res.status(404).json({ error: "Veículo não encontrado" });

    await carro.update({ marca, modelo, ano, fornecedor_id, quantidade });
    res.status(200).json(carro);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCarro = async (req, res) => {
  try {
    const carro = await db.Carro.findByPk(req.params.id);
    if (!carro) return res.status(404).json({ error: "Veículo não encontrado" });

    await carro.destroy();
    res.status(200).json({ message: "Veículo excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
