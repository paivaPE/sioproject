const Ocorrencia = require('../models/Ocorrencia');

module.exports = {

    async listar(req,res){

        const ocorrencias = await Ocorrencia.findAll();

        res.render('ocorrencias/index',{
            ocorrencias
        });

    },

    nova(req,res){

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

    async editar(req,res){

        const ocorrencia = await Ocorrencia.findByPk(req.params.id);

        res.render('ocorrencias/editar',{

            ocorrencia

        });

    },

    async atualizar(req,res){

        await Ocorrencia.update({

            aluno:req.body.aluno,

            turma:req.body.turma,

            data_ocorrencia:req.body.data_ocorrencia,

            tipo_infracao:req.body.tipo_infracao,

            nivel:req.body.nivel,

            descricao:req.body.descricao

        },{

            where:{

                id:req.params.id

            }

        });

        res.redirect('/ocorrencias');

    },

    async excluir(req,res){

        await Ocorrencia.destroy({

            where:{

                id:req.params.id

            }

        });

        res.redirect('/ocorrencias');

    }

}