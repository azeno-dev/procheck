#!/usr/bin/env node

/**
 * PocketBase Migration Script for ProCheck
 * Creates required collections: 'batches' and 'live_events'
 *
 * Usage:
 *   node scripts/pb-migrate.js --admin-email YOUR_EMAIL --admin-password YOUR_PASSWORD
 */

const args = process.argv.slice(2);
const getArg = (name) => {
  const idx = args.indexOf(`--${name}`);
  return idx !== -1 ? args[idx + 1] : null;
};

const PB_URL = 'https://awb-api-checker.azeno.dev';
const adminEmail = getArg('admin-email');
const adminPassword = getArg('admin-password');

if (!adminEmail || !adminPassword) {
  console.error('Usage: node scripts/pb-migrate.js --admin-email EMAIL --admin-password PASSWORD');
  process.exit(1);
}

async function pbFetch(path, method = 'GET', body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = token;
  const res = await fetch(`${PB_URL}/api${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(data)}`);
  return data;
}

async function collectionExists(token, name) {
  try { await pbFetch(`/collections/${name}`, 'GET', null, token); return true; }
  catch { return false; }
}

async function main() {
  console.log('Authenticating as admin...');
  const auth = await pbFetch('/admins/auth-with-password', 'POST', { identity: adminEmail, password: adminPassword });
  const token = auth.token;
  console.log('Admin authenticated.\n');

  // batches collection
  if (await collectionExists(token, 'batches')) {
    console.log('Collection "batches" already exists - skipping.');
  } else {
    console.log('Creating "batches" collection...');
    await pbFetch('/collections', 'POST', {
      name: 'batches',
      type: 'base',
      schema: [
        { name: 'batchId',    type: 'text',   required: true  },
        { name: 'name',       type: 'text',   required: false },
        { name: 'source',     type: 'text',   required: false },
        { name: 'courier',    type: 'text',   required: false },
        { name: 'totalCount', type: 'number', required: false },
        { name: 'readyCount', type: 'number', required: false },
        { name: 'progress',   type: 'number', required: false },
        { name: 'data',       type: 'json',   required: false, options: { maxSize: 5000000 } },
        {
          name: 'user',
          type: 'relation',
          required: false,
          options: {
            collectionId: '_pb_users_auth_',
            cascadeDelete: false,
            maxSelect: 1,
            displayFields: []
          }
        },
      ],
      listRule:   '',
      viewRule:   '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
    }, token);
    console.log('"batches" collection created.\n');
  }

  // live_events collection
  if (await collectionExists(token, 'live_events')) {
    console.log('Collection "live_events" already exists - skipping.');
  } else {
    console.log('Creating "live_events" collection...');
    await pbFetch('/collections', 'POST', {
      name: 'live_events',
      type: 'base',
      schema: [
        { name: 'room',   type: 'text', required: false },
        { name: 'type',   type: 'text', required: false },
        { name: 'awb',    type: 'text', required: false },
        { name: 'status', type: 'text', required: false },
        { name: 'payload', type: 'json', required: false, options: { maxSize: 5000000 } },
        {
          name: 'user',
          type: 'relation',
          required: false,
          options: {
            collectionId: '_pb_users_auth_',
            cascadeDelete: false,
            maxSelect: 1,
            displayFields: []
          }
        },
      ],
      listRule:   '',
      viewRule:   '',
      createRule: '',
      updateRule: '',
      deleteRule: '',
    }, token);
    console.log('"live_events" collection created.\n');
  }

  console.log('Migration complete!');
}

main().catch((err) => {
  console.error('Migration failed:', err.message || err);
  process.exit(1);
});
