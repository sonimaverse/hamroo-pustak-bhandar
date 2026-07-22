import { describe, it } from 'node:test';
import assert from 'node:assert';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

describe('Error Handling & Security', async () => {
  it('should return 404 for nonexistent route', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/nonexistent`, {
      method: 'GET',
    });
    assert.strictEqual(res.status, 404);
  });

  it('should sanitize XSS in request body', async () => {
    const maliciousPayload = {
      fullName: '<script>alert(1)</script>',
      email: 'xss@test.com',
      phone: '+9779841000001',
      password: 'password123',
    };
    const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(maliciousPayload),
    });
    assert.strictEqual(res.status, 400);
  });
});
