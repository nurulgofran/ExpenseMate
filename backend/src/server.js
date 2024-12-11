const express = require('express');
const cors = require('cors');
const http = require('http');
const routes = require('./routes/index');
const RealtimeUpdatesService = require('./services/RealtimeUpdatesService');

const app = express();
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json());

app.use('/api', routes);

const server = http.createServer(app);
RealtimeUpdatesService.init(server);

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});