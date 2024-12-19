// models/carro.js
module.exports = (sequelize, DataTypes) => {
  const Carro = sequelize.define('Carro', {
    marca: {
      type: DataTypes.STRING,
      allowNull: false
    },
    modelo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    fornecedor_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Fornecedors',
        key: 'id'
      }
    }
  });

  Carro.associate = (models) => {
    Carro.belongsTo(models.Fornecedor, {
      foreignKey: 'fornecedor_id',
      as: 'fornecedor'
    });
  };

  return Carro;
};
