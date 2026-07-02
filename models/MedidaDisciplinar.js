const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedidaDisciplinar = sequelize.define('MedidaDisciplinar', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    nome: {
        type: DataTypes.STRING,
        allowNull: false
    },

    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    duracao: {
        type: DataTypes.STRING,
        allowNull: false
    },

    ativo: {
        type: DataTypes.STRING,
        allowNull: false
    }

}, {
    tableName: 'medidas_disciplinares',
    timestamps: false
});

module.exports = MedidaDisciplinar;