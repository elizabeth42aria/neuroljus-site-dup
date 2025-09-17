// Minimal Express server with /api/signals
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

const MAX_EVENTS = 50;
let events = [];

app.post('/api/signals', (req, res) => {
  const payload = req.body;
  if (!payload || !payload.device_id || !payload.timestamp || !payload.signals) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  events.push(payload);
  if (events.length > MAX_EVENTS) events.shift();
  res.json({ status: 'ok' });
});

app.get('/api/signals', (req, res) => {
  res.json(events);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Lab server running on port ${PORT}`);
});
