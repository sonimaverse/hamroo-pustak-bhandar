import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

describe('Authentication Endpoints', async () => {
  it('should reject register with missing fields', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    assert.strictEqual(res.status, 400);
  });

  it('should reject register with duplicate email', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Test User',
        email: 'duplicate@test.com',
        phone: '+9779841000001',
        password: 'password123',
      }),
    });
    assert.strictEqual(res.status, 409);
  });

  it('should reject login with invalid credentials', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'nonexistent@test.com',
        password: 'wrongpassword',
      }),
    });
    assert.strictEqual(res.status, 401);
  });

  it('should reject profile access without token', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/auth/profile`);
    assert.strictEqual(res.status, 401);
  });
});
