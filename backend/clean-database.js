require('dotenv').config();
const mongoose = require('mongoose');

async function cleanDatabase() {
  try {
    console.log('🗑️  Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Get all collections
    const collections = await db.listCollections().toArray();
    
    console.log('📋 Found collections:');
    collections.forEach(col => console.log(`   - ${col.name}`));
    console.log('');

    // Ask for confirmation
    console.log('⚠️  WARNING: This will DELETE ALL DATA from all collections!');
    console.log('⚠️  Type "yes" to confirm deletion:\n');

    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Confirm deletion (yes/no): ', async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        console.log('\n🗑️  Deleting all data...\n');

        for (const collection of collections) {
          const result = await db.collection(collection.name).deleteMany({});
          console.log(`✅ Deleted ${result.deletedCount} documents from ${collection.name}`);
        }

        console.log('\n✅ All data deleted successfully!');
      } else {
        console.log('\n❌ Deletion cancelled');
      }

      await mongoose.connection.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

cleanDatabase();
