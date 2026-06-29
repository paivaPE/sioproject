const { Sequelize } = require('sequelize');
const path = require('path');

// Configuração do SQLite3 - Prático, rápido e sem precisar instalar o MySQL/Postgres na máquina
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '..', 'sio_banco.sqlite'), // Cria o arquivo de banco na raiz do projeto
    logging: false // Deixa o terminal limpo, sem poluição de logs SQL
});

module.exports = sequelize;