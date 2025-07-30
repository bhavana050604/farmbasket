const mysql = require('mysql2/promise');
require('dotenv').config();

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing EFarming database...');
    
    // Connect to database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT || 3306,
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });

    console.log('✅ Connected to database successfully');

    // Create tables
    const createTables = [
      `CREATE TABLE IF NOT EXISTS farmers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        address TEXT,
        mobile VARCHAR(15),
        dob DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS buyers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        address TEXT,
        mobile VARCHAR(15),
        dob DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,
      
      `CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        quantity INT NOT NULL,
        image LONGBLOB,
        farmer_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (farmer_id) REFERENCES farmers(id) ON DELETE CASCADE
      )`,
      
      `CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        buyer_id INT,
        product_id INT,
        quantity INT NOT NULL,
        total_amount DECIMAL(10,2) NOT NULL,
        status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
        address TEXT,
        mobile VARCHAR(15),
        pincode VARCHAR(10),
        city VARCHAR(100),
        state VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (buyer_id) REFERENCES buyers(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
      )`
    ];

    // Execute each table creation
    for (let i = 0; i < createTables.length; i++) {
      await connection.execute(createTables[i]);
      console.log(`✅ Created table ${i + 1}/4`);
    }

    // Insert sample data
    const sampleData = [
      `INSERT INTO farmers (name, password, address, mobile, dob) VALUES 
       ('John Farmer', 'password123', 'Farm Address 1', '1234567890', '1990-01-01')
       ON DUPLICATE KEY UPDATE name = VALUES(name)`,
      
      `INSERT INTO buyers (name, password, address, mobile, dob) VALUES 
       ('Jane Buyer', 'password123', 'Buyer Address 1', '0987654321', '1995-01-01')
       ON DUPLICATE KEY UPDATE name = VALUES(name)`
    ];

    for (let i = 0; i < sampleData.length; i++) {
      await connection.execute(sampleData[i]);
      console.log(`✅ Inserted sample data ${i + 1}/2`);
    }

    console.log('🎉 Database initialization completed successfully!');
    console.log('📝 Admin credentials: username=admin, password=admin');
    
    await connection.end();

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

// Run initialization if this file is executed directly
if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase; 