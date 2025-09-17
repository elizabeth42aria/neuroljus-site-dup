// mock_camera_adapter.js
// Emits mock hand/face events (MediaPipe-like)

const EventEmitter = require('events');
class MockCameraAdapter extends EventEmitter {
  constructor() {
    super();
    this.interval = null;
  }
  start() {
    this.interval = setInterval(() => {
      const payload = {
        device_id: 'mock-camera-001',
        timestamp: new Date().toISOString(),
        signals: {
          movement: 'hand_near_face',
          gesture: ['sign_help', 'sign_peace'][Math.floor(Math.random()*2)]
        },
        status_hint: 'active',
        confidence: Math.random(),
        metadata: { source: 'mock', firmware: 'v0.0.0' }
      };
      this.emit('signal', payload);
    }, 2000);
  }
  stop() {
    clearInterval(this.interval);
  }
}
module.exports = MockCameraAdapter;
