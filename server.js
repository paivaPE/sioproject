const express = require('express');
const { engine } = require('express-handlebars');
const sequelize = require('./config/database');


const Usuario = require('./models/Usuario');
const MedidaDisciplinar = require('./models/MedidaDisciplinar');
const Ocorrencia = require('./models/Ocorrencia');
const ocorrenciaRoutes = require("./routes/ocorrenciaRoutes");

const app = express();


app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');


app.use(express.urlencoded({ extended: true })); 
app.use(express.json());                         
app.use(express.static('public'));               
app.use('/ocorrencias', ocorrenciaRoutes);


 
app.get('/', (req, res) => { 
    res.render('entrada'); 
});

/**
 * Dashboard SIO
 */
app.get('/dashboard', async (req, res) => {
    try {
        
        const totalAlunos = await Usuario.count({ where: { tipo: 'estudante' } });
        
        
        const totalOcorrencias = await Ocorrencia.count();

        
        res.render('dashboard', { totalAlunos, totalOcorrencias });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao carregar os contadores da Dashboard.");
    }
});

/**
 * Gerenciamento de Usuários
 */

app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.render('usuarios', { usuarios });
    } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        res.status(500).send("Erro ao listar usuários no banco.");
    }
});

app.post('/usuarios/novo', async (req, res) => {
    try {
        const { nome, tipo, matricula } = req.body;
        await Usuario.create({ nome, tipo, matricula });
        res.redirect('/usuarios'); 
    } catch (err) {
        console.error("Erro ao criar usuário:", err);
        res.status(500).send("Erro ao cadastrar novo usuário.");
    }
});

app.post('/usuarios/deletar/:id', async (req, res) => {
    try {
        await Usuario.destroy({ where: { id: req.params.id } });
        res.redirect('/usuarios'); 
    } catch (err) {
        console.error("Erro ao deletar usuário:", err);
        res.status(500).send("Erro ao remover usuário.");
    }
});

app.get('/usuarios/editar/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.params.id);
        res.render('editar-usuario', { usuario }); 
    } catch (err) {
        console.error("Erro ao buscar usuário para edição:", err);
        res.status(500).send("Erro ao carregar dados do usuário.");
    }
});

app.post('/usuarios/editar/:id', async (req, res) => {
    try {
        const { nome, tipo, matricula } = req.body;
        
       
        await Usuario.update(
            { nome, tipo, matricula },
            { where: { id: req.params.id } }
        );
        
        res.redirect('/usuarios'); 
    } catch (err) {
        console.error("Erro ao atualizar usuário:", err);
        res.status(500).send("Erro ao salvar alterações do usuário.");
    }
});


app.get('/painel-pais', async (req, res) => {
    try {
        const estudantes = await Usuario.findAll({ where: { tipo: 'estudante' } });
        res.render('painel_pais', { estudantes, buscou: false });
    } catch (err) {
        res.status(500).send("Erro ao carregar painel dos pais.");
    }
});


app.get('/painel-pais/busca', async (req, res) => {
    try {
        const { aluno_id } = req.query;
        
        
        const estudantes = await Usuario.findAll({ where: { tipo: 'estudante' } });

        
        const ocorrencias = await Ocorrencia.findAll({
            where: { aluno_id: aluno_id }
        });

      
        res.render('painel_pais', { 
            estudantes, 
            ocorrencias, 
            buscou: true 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao processar busca de ocorrências.");
    }
});



 app.use("/ocorrencias", ocorrenciaRoutes);


app.get('/medidas', async (req, res) => {
    try {
        const medidas = await MedidaDisciplinar.findAll();
        res.render('medidas', { listaDeMedidas: medidas });
    } catch (err) {
        res.status(500).send("Erro ao acessar módulo de medidas.");
    }
});




const PORT = 3000;


sequelize.sync({ force: false })
    .then(() => {
        console.log("Banco de dados do SIO sincronizado com sucesso!");
        app.listen(PORT, () => {
            console.log(`SIO rodando em http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("falha no db", err);
    });