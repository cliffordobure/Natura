require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

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

    console.log('\n🧪 Testing Login After Fix...\n');

    // Test with admin credentials
    const email = 'admin@natura.com';
    const password = 'password123';

    console.log(`Testing login for: ${email}`);
    
    // Find user with password
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found');
    console.log(`   - Role: ${user.role}`);
    console.log(`   - Active: ${user.isActive}`);
    console.log(`   - Has password field: ${user.password ? 'Yes' : 'No'}`);
    
    // Test password match
    const isPasswordMatch = await user.matchPassword(password);
    console.log(`   - Password matches: ${isPasswordMatch ? 'Yes' : 'No'}`);
    
    if (isPasswordMatch) {
      console.log('🎉 LOGIN SHOULD WORK NOW!');
      console.log('\nTry logging in with:');
      console.log('Email: admin@natura.com');
      console.log('Password: password123');
    } else {
      console.log('❌ Password still not matching');
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

testLogin();
