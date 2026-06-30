const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Usuario = require('./Usuario');

const Ocorrencia = sequelize.define('Ocorrencia', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    aluno_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'usuarios',
            key: 'id'
        }
    },
    data_ocorrencia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    turma: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tipo_infracao: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nivel: {
        type: DataTypes.STRING, // 'Leve', 'Média', 'Grave'
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

// Criando o relacionamento: Uma Ocorrência pertence a um Aluno (Usuario)
Ocorrencia.belongsTo(Usuario, { foreignKey: 'aluno_id', as: 'Aluno' });

module.exports = Ocorrencia;