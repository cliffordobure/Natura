require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected to:', mongoose.connection.host);
    console.log('Database name:', mongoose.connection.name);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const checkProductionDB = async () => {
  try {
    await connectDB();

    console.log('\n🔍 Checking Production Database...\n');

    // Get all users
    const users = await User.find({});
    console.log(`Total users in database: ${users.length}`);
    
    if (users.length === 0) {
      console.log('❌ NO USERS FOUND in the database!');
      console.log('This means the demo data was not created in this database.');
      console.log('\nPossible causes:');
      console.log('1. Demo data was created in a different database');
      console.log('2. Demo data was deleted');
      console.log('3. Database connection string is different');
      return;
    }

    console.log('\n📋 All users in database:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. Email: ${user.email}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log('');
    });

    // Test specific login attempts
    console.log('🔑 Testing login attempts...\n');
    
    const testEmails = [
      'admin@natura.com',
      'emma.wilson@example.com',
      'sarah@natura.com'
    ];

    for (const email of testEmails) {
      console.log(`Testing: ${email}`);
      const user = await User.findOne({ email }).select('+password');
      
      if (user) {
        console.log(`✅ Found user: ${email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   Active: ${user.isActive}`);
        console.log(`   Has password: ${user.password ? 'Yes' : 'No'}`);
        
        // Test password
        if (user.password) {
          const bcrypt = require('bcryptjs');
          const isMatch = await bcrypt.compare('password123', user.password);
          console.log(`   Password 'password123' matches: ${isMatch ? 'Yes' : 'No'}`);
        }
      } else {
        console.log(`❌ User NOT found: ${email}`);
        
        // Check for similar emails
        const similarUsers = await User.find({
          email: { $regex: email.split('@')[0], $options: 'i' }
        });
        
        if (similarUsers.length > 0) {
          console.log(`   Similar emails found:`);
          similarUsers.forEach(u => console.log(`   - ${u.email}`));
        }
      }
      console.log('');
    }

    // Check database stats
    console.log('📊 Database Statistics:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections:', collections.map(c => c.name));
    
    const userCount = await User.countDocuments();
    console.log(`User documents: ${userCount}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

checkProductionDB();
