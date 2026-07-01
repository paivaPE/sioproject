const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MedidaDisciplinar = sequelize.define('MedidaDisciplinar', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome_medida: {
        type: DataTypes.STRING,
        allowNull: false
    },
    descricao: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'medidas_disciplinares',
    timestamps: false
});

module.exports = MedidaDisciplinar;