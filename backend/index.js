// backend/index.js (Versão de Depuração)

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const db = require('./models');
const { Op } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// --- ROTAS DE USUÁRIOS (Sem alterações) ---
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios.' });
  }
  try {
    const newUser = await db.User.create({ id: uuidv4(), name, email });
    res.status(201).json(newUser);
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Este email já está cadastrado.' });
    }
    res.status(500).json({ error: 'Erro ao cadastrar usuário.', details: error.message });
  }
});
app.get('/users', async (req, res) => {
  const { name, email } = req.query;
  const where = {};
  if (name) {
    where.name = { [Op.like]: `%${name}%` };
  }
  if (email) {
    where.email = { [Op.like]: `%${email}%` };
  }
  try {
    const users = await db.User.findAll({ where });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários.' });
  }
});
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuário.' });
  }
});


// --- ENDPOINT DE CLIMA (COM LOGS DE DEPURAÇÃO) ---
app.get('/weather/:city', async (req, res) => {
  // LOG 1: Verificando se a rota foi acessada
  console.log('--- [DEBUG] Rota /weather/:city acessada ---');
  
  const { city } = req.params;
  // LOG 2: Verificando a cidade recebida
  console.log(`[DEBUG] Cidade recebida: ${city}`);

  const apiKey = process.env.WEATHER_API_KEY;
  // LOG 3: Verificando a chave da API
  console.log(`[DEBUG] Chave da API utilizada: ${apiKey ? apiKey.substring(0, 4) + '...' : 'NENHUMA CHAVE ENCONTRADA'}`);

  if (!apiKey) {
    console.error('[DEBUG] ERRO: Chave da API não está no arquivo .env!');
    return res.status(500).json({ error: 'Chave da API de clima não configurada.' });
  }

  const url = `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=yes&lang=pt`;
  // LOG 4: Mostrando a URL final que será chamada
  console.log(`[DEBUG] URL da API externa que será chamada: ${url}`);

  try {
    // LOG 5: Marcando o início da chamada externa
    console.log('[DEBUG] Tentando fazer a chamada para a WeatherAPI...');
    
    const response = await axios.get(url, { timeout: 10000 }); // Adicionando um timeout de 10 segundos
    
    // LOG 6: Se chegarmos aqui, a chamada foi bem-sucedida
    console.log('[DEBUG] Sucesso! Resposta recebida da WeatherAPI.');
    res.status(200).json(response.data);

  } catch (error) {
    // LOG 7: Se chegarmos aqui, a chamada falhou. Vamos ver o porquê.
    console.error('[DEBUG] A chamada para a WeatherAPI FALHOU. Detalhes do erro:');
    
    if (error.code === 'ECONNABORTED') {
        console.error('[DEBUG] O erro foi um TIMEOUT. A API demorou mais de 10 segundos para responder.');
        return res.status(504).json({ error: 'A API de clima demorou muito para responder.' });
    }
    
    if (error.response) {
      // O servidor da WeatherAPI respondeu com um código de erro (4xx, 5xx)
      console.error(`[DEBUG] Status do erro: ${error.response.status}`);
      console.error('[DEBUG] Dados do erro:', error.response.data);
      return res.status(error.response.status).json({
        error: `Erro ao buscar dados do clima para ${city}.`,
        details: error.response.data,
      });
    } else {
      // Um erro de rede ou outro problema impediu a comunicação
      console.error('[DEBUG] Erro de rede ou desconhecido:', error.message);
      res.status(500).json({ error: 'Erro de conexão ao contatar a API de clima.' });
    }
  }
});


// --- INÍCIO DO SERVIDOR ---
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
  });