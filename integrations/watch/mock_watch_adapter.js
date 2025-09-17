// mock_watch_adapter.js
// Simulates HR, HRV, EDA

const EventEmitter = require('events');
class MockWatchAdapter extends EventEmitter {
  constructor() {
    super();
    this.interval = null;
  }
  start() {
    this.interval = setInterval(() => {
      const payload = {
        device_id: 'mock-watch-001',
        timestamp: new Date().toISOString(),
        signals: {
          heart_rate: 60 + Math.floor(Math.random()*40),
          hrv: 40 + Math.floor(Math.random()*20),
          eda: Math.random(),
        },
        status_hint: 'calm',
        confidence: 0.8 + Math.random()*0.2,
        metadata: { source: 'mock', firmware: 'v0.0.0' }
      };
      this.emit('signal', payload);
    }, 2000);
  }
  stop() {
    clearInterval(this.interval);
  }
}
module.exports = MockWatchAdapter;
