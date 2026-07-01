const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Ocorrencia = sequelize.define('Ocorrencia', {

    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    aluno: {
        type: DataTypes.STRING,
        allowNull: false
    },

    turma: {
        type: DataTypes.STRING,
        allowNull: false
    },

    data_ocorrencia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_infracao: {
        type: DataTypes.STRING,
        allowNull: false
    },

    nivel: {
        type: DataTypes.STRING,
        allowNull: false
    },

    descricao: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'ocorrencias',
    timestamps: false
});

module.exports = Ocorrencia;