const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./models');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

// Testa a conexão com o banco
db.sequelize.authenticate()
  .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso!'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

db.sequelize.sync()
  .then(() => console.log('Banco de dados sincronizado'))
  .catch(err => console.error('Erro ao sincronizar o banco de dados:', err));

// Rotas
const fornecedorRouter = require('./routes/fornecedorRouter');
const carroRouter = require('./routes/carroRouter');

app.use('/api/fornecedores', fornecedorRouter);
app.use('/api/carros', carroRouter);

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
