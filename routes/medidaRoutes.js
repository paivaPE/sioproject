const express = require('express');

const router = express.Router();

const controller = require('../controllers/medidaController');

router.get('/', controller.listar);

router.get('/nova', controller.nova);

router.post('/salvar', controller.salvar);

router.get('/editar/:id', controller.editar);

router.post('/atualizar/:id', controller.atualizar);

router.post('/excluir/:id', controller.excluir);

module.exports = router;