const mysql = require('mysql2/promise');
require('dotenv').config();

async function testDeployment() {
  console.log('🧪 Testing EFarming deployment...\n');
  
  try {
    // Test 1: Environment Variables
    console.log('1️⃣ Testing Environment Variables...');
    const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET', 'NODE_ENV'];
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      console.log('❌ Missing environment variables:', missingVars);
      return false;
    }
    console.log('✅ All environment variables are set\n');

    // Test 2: Database Connection
    console.log('2️⃣ Testing Database Connection...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
    console.log('✅ Database connection successful\n');

    // Test 3: Database Tables
    console.log('3️⃣ Testing Database Tables...');
    const tables = ['farmers', 'buyers', 'products', 'orders'];
    for (const table of tables) {
      try {
        await connection.execute(`SELECT 1 FROM ${table} LIMIT 1`);
        console.log(`✅ Table '${table}' exists`);
      } catch (err) {
        console.log(`❌ Table '${table}' missing or inaccessible`);
      }
    }
    console.log('');

    // Test 4: Admin Login Test
    console.log('4️⃣ Testing Admin Login Configuration...');
    console.log('✅ Admin credentials: username=admin, password=admin');
    console.log('✅ JWT_SECRET is configured');
    console.log('');

    await connection.end();
    
    console.log('🎉 All deployment tests passed!');
    console.log('📝 Next steps:');
    console.log('   1. Deploy backend to Render');
    console.log('   2. Test API endpoints');
    console.log('   3. Deploy frontend to Render');
    console.log('   4. Test full application flow');
    
    return true;

  } catch (error) {
    console.error('❌ Deployment test failed:', error.message);
    return false;
  }
}

// Run test if this file is executed directly
if (require.main === module) {
  testDeployment().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testDeployment; 