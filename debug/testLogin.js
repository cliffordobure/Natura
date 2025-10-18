require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const bcrypt = require('bcryptjs');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const testLogin = async () => {
  try {
    await connectDB();

    console.log('\n🧪 Testing Login Logic...\n');

    const testCredentials = [
      { email: 'admin@natura.com', password: 'password123' },
      { email: 'emma.wilson@example.com', password: 'password123' },
      { email: 'sarah@natura.com', password: 'password123' }
    ];

    for (const { email, password } of testCredentials) {
      console.log(`\n🔍 Testing: ${email}`);
      
      try {
        // Step 1: Check if user exists
        const user = await User.findOne({ email }).select('+password');
        
        if (!user) {
          console.log('❌ User not found');
          continue;
        }
        
        console.log('✅ User found');
        console.log(`   - Role: ${user.role}`);
        console.log(`   - Active: ${user.isActive}`);
        console.log(`   - School ID: ${user.schoolId}`);
        
        // Step 2: Check if user is active
        if (!user.isActive) {
          console.log('❌ Account is inactive');
          continue;
        }
        
        console.log('✅ Account is active');
        
        // Step 3: Check password
        const isPasswordMatch = await user.matchPassword(password);
        
        if (!isPasswordMatch) {
          console.log('❌ Password mismatch');
          continue;
        }
        
        console.log('✅ Password matches');
        console.log('🎉 LOGIN SUCCESS!');
        
      } catch (error) {
        console.log(`❌ Error: ${error.message}`);
      }
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

testLogin();
