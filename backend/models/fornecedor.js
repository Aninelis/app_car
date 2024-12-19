// models/fornecedor.js
module.exports = (sequelize, DataTypes) => {
    const Fornecedor = sequelize.define('Fornecedor', {
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      telefone: {
        type: DataTypes.STRING
      }
    });
  
    Fornecedor.associate = (models) => {
      Fornecedor.hasMany(models.Carro, {
        foreignKey: 'fornecedor_id',
        as: 'carros'
      });
    };
  
    return Fornecedor;
  };
  