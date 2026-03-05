/**
 * Shared Test Helpers
 * Auth: pass userId directly via X-User-Id header — no tokens needed.
 */
const BASE_URL = 'http://localhost:5000/api';

const apiGet = async (endpoint, userId = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (userId) headers['X-User-Id'] = String(userId);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, { method: 'GET', headers });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const apiPost = async (endpoint, body, userId = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (userId) headers['X-User-Id'] = String(userId);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const apiPatch = async (endpoint, body, userId = null) => {
  const headers = { 'Content-Type': 'application/json' };
  if (userId) headers['X-User-Id'] = String(userId);

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(body)
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: err.message };
  }
};

const logResult = (label, passed, data = null) => {
  if (passed) {
    console.log(`  ✅ PASS: ${label}`);
  } else {
    console.log(`  ❌ FAIL: ${label}`);
    if (data) console.log('     Details:', JSON.stringify(data));
  }
};

module.exports = { apiGet, apiPost, apiPatch, logResult };
