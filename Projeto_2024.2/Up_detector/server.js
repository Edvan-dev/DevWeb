// Configuração do JSON Server e scripts em ESM
import express from 'express';
import { createServer } from 'http';
import { join } from 'path';
import { exec } from 'child_process';
import fs from 'fs';

const app = express();
const PORT = 3000;

// Diretório público para servir arquivos estáticos
const PUBLIC_DIR = join(process.cwd(), 'public');

// Middleware para servir arquivos estáticos
app.use(express.static(PUBLIC_DIR));

// Inicializa o JSON Server
const startJsonServer = () => {
    exec('json-server --watch db.json --port 3001', (error, stdout, stderr) => {
        if (error) {
            console.error(`Erro ao iniciar o JSON Server: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`Erro: ${stderr}`);
            return;
        }
        console.log(`JSON Server iniciado:\n${stdout}`);
    });
};

// Endpoint inicial para verificar o servidor
app.get('/', (req, res) => {
    res.sendFile(join(PUBLIC_DIR, 'login.html'));
});

// Configuração do body-parser para lidar com requisições JSON
app.use(express.json());

// Endpoints principais
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Campos obrigatórios não preenchidos.' });
    }
    const dbPath = join(process.cwd(), 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath));

    if (db.users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Usuário já existe.' });
    }

    db.users.push({ username, password });
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json({ message: 'Usuário registrado com sucesso!' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const dbPath = join(process.cwd(), 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath));

    const user = db.users.find(u => u.username === username && u.password === password);
    if (user) {
        return res.status(200).json({ message: 'Login bem-sucedido!' });
    } else {
        return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
});

app.post('/api/urls', (req, res) => {
    const { url } = req.body;
    if (!url) {
        return res.status(400).json({ message: 'URL/IP é obrigatório.' });
    }
    const dbPath = join(process.cwd(), 'db.json');
    const db = JSON.parse(fs.readFileSync(dbPath));

    db.urls.push({ url });
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.status(201).json({ message: 'URL/IP cadastrado com sucesso!' });
});

// Criação do servidor HTTP
const server = createServer(app);
server.listen(PORT, () => {
    console.log(`Servidor rodando em: http://localhost:${PORT}`);
    console.log('Iniciando JSON Server...');
    startJsonServer();
});

// Arquivo db.json inicial
const dbPath = join(process.cwd(), 'db.json');
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ users: [], urls: [] }, null, 2));
}

