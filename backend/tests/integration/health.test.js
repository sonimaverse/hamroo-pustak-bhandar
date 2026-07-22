import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

describe('Health Check', async () => {
  it('should return 200 OK with server status', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/health`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.message.includes('running'));
  });
});
