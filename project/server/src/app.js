const cors = require('cors');
const express = require('express');

const app = express();

app.use(
    cors({
        origin: true,
        credentials: true,
    }),
);
app.use(express.json());

app.get('/api/health', (_req, res) => {
    res.json({
        ok: true,
        service: 'silicon-curator-server',
        timestamp: new Date().toISOString(),
    });
});

app.get('/', (_req, res) => {
    res.send('Silicon Curator server is running.');
});

module.exports = app;
