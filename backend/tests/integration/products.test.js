import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';

describe('Product Endpoints', async () => {
  it('should return products list (public)', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products`);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(Array.isArray(data.data.products));
  });

  it('should reject admin-only endpoints without auth', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Test' }),
    });
    assert.strictEqual(res.status, 401);
  });

  it('should return 404 for nonexistent product', async () => {
    const res = await fetch(`${BASE_URL}/api/v1/products/64f1b2c3d4e5f67890123456`);
    assert.strictEqual(res.status, 404);
  });
});
