const express = require('express');
const { engine } = require('express-handlebars');
const sequelize = require('./config/database');

// 1. IMPORTAÇÃO DOS MODELOS DO BANCO DE DADOS
// (Deixa o banco estruturado antes dos meninos iniciarem as tarefas deles)
const Usuario = require('./models/Usuario');
const MedidaDisciplinar = require('./models/MedidaDisciplinar');
const Ocorrencia = require('./models/Ocorrencia');
const ocorrenciaRoutes = require("./routes/ocorrenciaRoutes");

const app = express();

// 2. CONFIGURAÇÃO DO ENGINE DE TEMPLATES (HANDLEBARS)
app.engine('handlebars', engine({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
}));
app.set('view engine', 'handlebars');
app.set('views', './views');

// 3. MIDDLEWARES OBRIGATÓRIOS
app.use(express.urlencoded({ extended: true })); // Permite ler dados enviados por formulários (POST)
app.use(express.json());                         // Permite ler requisições em formato JSON
app.use(express.static('public'));               // Serve os arquivos CSS e Imagens da pasta public
app.use('/ocorrencias', ocorrenciaRoutes);

// -------------------------------------------------------------
// 4. MAPEAMENTO DE ROTAS (CONFORME O PROTÓTIPO DO CANVA)
// -------------------------------------------------------------

/**
 * ROTA: Escolha Inicial de Perfil
 * Abre a tela com as 3 opções de entrada (image_e92979.jpg)
 */
app.get('/', (req, res) => { 
    res.render('entrada'); 
});

/**
 * ROTA: A Tela Principal do SIO (A Dashboard)
 * Renderiza os cards e calcula os indicadores dinamicamente (image_f40aa3.png)
 */
app.get('/dashboard', async (req, res) => {
    try {
        // Conta no banco quantos usuários do tipo estudante existem
        const totalAlunos = await Usuario.count({ where: { tipo: 'estudante' } });
        
        // Conta no banco o número total de ocorrências criadas
        const totalOcorrencias = await Ocorrencia.count();

        // Passa os valores calculados para preencher os cards numéricos da tela
        res.render('dashboard', { totalAlunos, totalOcorrencias });
    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao carregar os contadores da Dashboard.");
    }
});

/**
 * ROTAS DO SEU MÓDULO: Gerenciamento de Usuários (Nicholas)
 * Acionado ao clicar no card "LISTA DE ALUNOS"
 */
// 1. GET: Renderiza a página e lista todos os usuários já cadastrados
app.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await Usuario.findAll();
        res.render('usuarios', { usuarios });
    } catch (err) {
        console.error("Erro ao buscar usuários:", err);
        res.status(500).send("Erro ao listar usuários no banco.");
    }
});

// 2. POST: Recebe os dados do formulário e cria o usuário no banco
app.post('/usuarios/novo', async (req, res) => {
    try {
        const { nome, tipo, matricula } = req.body;
        await Usuario.create({ nome, tipo, matricula });
        res.redirect('/usuarios'); // Redireciona de volta para atualizar a lista
    } catch (err) {
        console.error("Erro ao criar usuário:", err);
        res.status(500).send("Erro ao cadastrar novo usuário.");
    }
});

// 3. POST: Deleta o usuário através do ID passado na URL
app.post('/usuarios/deletar/:id', async (req, res) => {
    try {
        await Usuario.destroy({ where: { id: req.params.id } });
        res.redirect('/usuarios'); // Redireciona de volta para atualizar a lista
    } catch (err) {
        console.error("Erro ao deletar usuário:", err);
        res.status(500).send("Erro ao remover usuário.");
    }
});

/**
 * ROTAS DO SEU MÓDULO: Painel de Consulta dos Pais (Nicholas - História H5)
 * Acionado ao clicar no card "MINHAS OCORRÊNCIAS"
 */
// 1. Rota para abrir a tela inicial do painel (Apenas mostra o select com os alunos)
app.get('/painel-pais', async (req, res) => {
    try {
        const estudantes = await Usuario.findAll({ where: { tipo: 'estudante' } });
        res.render('painel_pais', { estudantes, buscou: false });
    } catch (err) {
        res.status(500).send("Erro ao carregar painel dos pais.");
    }
});

// 2. Rota que faz a busca real das ocorrências daquele aluno no banco de dados
app.get('/painel-pais/busca', async (req, res) => {
    try {
        const { aluno_id } = req.query;
        
        // Recarrega a lista para manter o select preenchido na tela
        const estudantes = await Usuario.findAll({ where: { tipo: 'estudante' } });

        // Busca no banco as ocorrências que pertencem ao ID do aluno selecionado
        const ocorrencias = await Ocorrencia.findAll({
            where: { aluno_id: aluno_id }
        });

        // Renderiza a página liberando a tabela com os resultados
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


// -------------------------------------------------------------
// 5. GATILHOS DA MAIN (Para os meninos não pegarem links quebrados)
// -------------------------------------------------------------

/**
 * ESBOÇO: Rota de Criar Ocorrência (Guilherme assume na branch feature/H_OCOR)
 * Acionado ao clicar no card "CRIAR OCORRÊNCIA"
 */
 app.use("/ocorrencias", ocorrenciaRoutes);

/**
 * ESBOÇO: Módulo de Medidas Disciplinares (Alison assume na branch feature/H_MEDIDA)
 * Acionado ao clicar no card "ARMAZENAR DOCUMENTOS / MEDIDAS"
 */
app.get('/medidas', async (req, res) => {
    try {
        const medidas = await MedidaDisciplinar.findAll();
        res.render('medidas', { listaDeMedidas: medidas });
    } catch (err) {
        res.status(500).send("Erro ao acessar módulo de medidas.");
    }
});



// 6. SINCRONIZAÇÃO DO BANCO E INICIALIZAÇÃO DO SERVIDOR
const PORT = 3000;

// O parâmetro { force: false } garante que o Sequelize não apague seus dados ao reiniciar o servidor
sequelize.sync({ force: false })
    .then(() => {
        console.log("=================================================");
        console.log("🛡️  Banco de dados do SIO sincronizado com sucesso!");
        app.listen(PORT, () => {
            console.log(`🚀 SIO rodando perfeitamente em http://localhost:${PORT}`);
            console.log("=================================================");
        });
    })
    .catch((err) => {
        console.error("❌ Falha crítica ao conectar/sincronizar banco de dados:", err);
    });