const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateDatabase() {
  try {
    // Connect to cloud database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    console.log('✅ Connected to cloud database');

    // Read and execute setup script
    const fs = require('fs');
    const setupScript = fs.readFileSync('./setup-database.sql', 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = setupScript.split(';').filter(stmt => stmt.trim());
    
    for (let statement of statements) {
      if (statement.trim()) {
        await connection.execute(statement);
        console.log('✅ Executed:', statement.substring(0, 50) + '...');
      }
    }

    console.log('✅ Database migration completed successfully');
    await connection.end();

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateDatabase();
}

module.exports = migrateDatabase; 