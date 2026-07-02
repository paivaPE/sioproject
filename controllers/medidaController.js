const MedidaDisciplinar = require('../models/MedidaDisciplinar');

module.exports = {

    async listar(req, res) {
        try {
            const medidas = await MedidaDisciplinar.findAll();

            res.render('medidas/index', {
                medidas
            });

        } catch (err) {
            console.error(err);
            res.send(err.message);
        }
    },

    nova(req, res) {
        res.render('medidas/nova');
    },

    async salvar(req, res) {

        await MedidaDisciplinar.create({

            nome: req.body.nome,
            descricao: req.body.descricao,
            duracao: req.body.duracao,
            ativo: req.body.ativo

        });

        res.redirect('/medidas');

    },

    async editar(req, res) {

        const medida = await MedidaDisciplinar.findByPk(req.params.id);

        res.render('medidas/editar', {
            medida
        });

    },

    async atualizar(req, res) {

        await MedidaDisciplinar.update({

            nome: req.body.nome,
            descricao: req.body.descricao,
            duracao: req.body.duracao,
            ativo: req.body.ativo

        }, {

            where: {
                id: req.params.id
            }

        });

        res.redirect('/medidas');

    },

    async excluir(req, res) {

        await MedidaDisciplinar.destroy({

            where: {
                id: req.params.id
            }

        });

        res.redirect('/medidas');

    }

};