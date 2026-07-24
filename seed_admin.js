const { Client } = require('pg');
const bcrypt = require('bcryptjs');

const dbUrl = "postgresql://postgres_admin:postgres_secret_key_2026@127.0.0.1:5455/sukabumi_eundeur_db";

async function seedAdmin() {
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    const hash = await bcrypt.hash('admin123', 10);
    await client.query(`
      INSERT INTO public.profiles (email, password_hash, username, full_name, role)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash;
    `, ['admin@sukabumi.com', hash, 'superadmin', 'Super Administrator', 'SUPER_ADMIN']);
    console.log('Admin user seeded successfully.');
  } catch (err) {
    console.error('Error seeding admin:', err);
  } finally {
    await client.end();
  }
}

seedAdmin();
