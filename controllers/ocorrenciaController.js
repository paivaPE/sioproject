const { Op } = require('sequelize');
const Ocorrencia = require('../models/Ocorrencia');
const Usuario = require('../models/Usuario');

module.exports = {

    async listar(req, res) {

        try {

            const busca = req.query.busca;
            const turma = req.query.turma;
            const tipo = req.query.tipo;

            console.log("BUSCA:", busca);
            console.log("TURMA:", turma);
            console.log("TIPO:", tipo);

            const where = {};

            // Busca por nome ou matrícula
            if (busca) {

                const alunos = await Usuario.findAll({
                    where: {
                        [Op.or]: [
                            {
                                nome: {
                                    [Op.like]: `%${busca}%`
                                }
                            },
                            {
                                matricula: {
                                    [Op.like]: `%${busca}%`
                                }
                            }
                        ],
                        tipo: 'estudante'
                    }
                });

                console.log(
                    "ALUNOS ENCONTRADOS:",
                    alunos.map(aluno => ({
                        nome: aluno.nome,
                        matricula: aluno.matricula,
                        tipo: aluno.tipo
                    }))
                );

                const nomesAlunos = alunos.map(aluno => aluno.nome);

                console.log("NOMES PARA BUSCAR:", nomesAlunos);

                where.aluno = {
                    [Op.in]: nomesAlunos
                };
            }

            // Filtro por turma
            if (turma) {

                where.turma = turma;

            }

            // Filtro por tipo de ocorrência
            if (tipo) {

                where.tipo_infracao = tipo;

            }

            const ocorrencias = await Ocorrencia.findAll({
                where
            });

            console.log(
                "OCORRÊNCIAS ENCONTRADAS:",
                ocorrencias.length
            );

            res.render('ocorrencias/index', {
                ocorrencias,
                busca,
                turma,
                tipo
            });

        } catch (erro) {

            console.error('ERRO AO BUSCAR OCORRÊNCIAS:');
            console.error(erro);

            res.status(500).send('Erro ao buscar ocorrências.');

        }

    },

    nova(req, res) {

        res.render('ocorrencias/nova');

    },

    async salvar(req, res) {

        try {

            console.log(req.body);

            await Ocorrencia.create({

                aluno: req.body.aluno,
                turma: req.body.turma,
                data_ocorrencia: req.body.data_ocorrencia,
                tipo_infracao: req.body.tipo_infracao,
                nivel: req.body.nivel,
                descricao: req.body.descricao

            });

            console.log("Ocorrência salva com sucesso!");

            res.redirect('/ocorrencias');

        } catch (erro) {

            console.error("ERRO AO SALVAR:");
            console.error(erro);

            res.status(500).send(erro.message);

        }

    },

    async editar(req, res) {

        const ocorrencia = await Ocorrencia.findByPk(req.params.id);

        res.render('ocorrencias/editar', {
            ocorrencia
        });

    },

    async atualizar(req, res) {

        await Ocorrencia.update({

            aluno: req.body.aluno,
            turma: req.body.turma,
            data_ocorrencia: req.body.data_ocorrencia,
            tipo_infracao: req.body.tipo_infracao,
            nivel: req.body.nivel,
            descricao: req.body.descricao

        }, {

            where: {
                id: req.params.id
            }

        });

        res.redirect('/ocorrencias');

    },

    async excluir(req, res) {

        await Ocorrencia.destroy({

            where: {
                id: req.params.id
            }

        });

        res.redirect('/ocorrencias');

    }

};