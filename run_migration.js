const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function runMigration() {
  const client = new Client({
    connectionString: 'postgresql://postgres_admin:postgres_secret_key_2026@127.0.0.1:5455/sukabumi_eundeur_db',
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename VARCHAR(255) PRIMARY KEY,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    const filename = '00003_business_and_superadmin.sql';
    const checkRes = await client.query('SELECT * FROM schema_migrations WHERE filename = $1', [filename]);
    
    if (checkRes.rowCount > 0) {
      console.log(`Skipping ${filename} - already migrated`);
    } else {
      const sqlPath = path.join(__dirname, 'docker', 'migrations', filename);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename]);
      console.log(`Migration ${filename} executed successfully`);
    }
  } catch (err) {
    console.error('Migration failed:', err.message);
  } finally {
    await client.end();
  }
}

runMigration();
