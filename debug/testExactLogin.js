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

const testExactLogin = async () => {
  try {
    await connectDB();

    console.log('\n🧪 Testing EXACT Login Logic...\n');

    // Test the exact same logic as the login controller
    const testCredentials = [
      { email: 'admin@natura.com', password: 'password123' },
      { email: 'emma.wilson@example.com', password: 'password123' },
      { email: 'sarah@natura.com', password: 'password123' }
    ];

    for (const { email, password } of testCredentials) {
      console.log(`\n🔍 Testing: "${email}"`);
      console.log(`Password: "${password}"`);
      
      try {
        // Step 1: Validate input (exact same as controller)
        if (!email || !password) {
          console.log('❌ Missing email or password');
          continue;
        }
        console.log('✅ Input validation passed');

        // Step 2: Check if user exists (exact same query as controller)
        const user = await User.findOne({ email }).select('+password');
        console.log(`User query result: ${user ? 'Found' : 'Not found'}`);
        
        if (!user) {
          console.log('❌ User not found - this is where your login is failing!');
          
          // Let's check if there are any similar emails
          const allUsers = await User.find({});
          console.log('All emails in database:');
          allUsers.forEach(u => console.log(`  - "${u.email}"`));
          
          // Check for exact match with different case
          const caseInsensitiveUser = await User.findOne({ 
            email: { $regex: `^${email}$`, $options: 'i' } 
          });
          if (caseInsensitiveUser) {
            console.log(`✅ Found case-insensitive match: "${caseInsensitiveUser.email}"`);
          }
          
          continue;
        }
        
        console.log('✅ User found');
        console.log(`   - Role: ${user.role}`);
        console.log(`   - Active: ${user.isActive}`);
        console.log(`   - Has password: ${user.password ? 'Yes' : 'No'}`);
        
        // Step 3: Check if user is active (exact same as controller)
        if (!user.isActive) {
          console.log('❌ User account is inactive');
          continue;
        }
        console.log('✅ User is active');
        
        // Step 4: Check password (exact same as controller)
        const isPasswordMatch = await user.matchPassword(password);
        
        if (!isPasswordMatch) {
          console.log('❌ Password does not match');
          continue;
        }
        
        console.log('✅ Password matches');
        console.log('🎉 LOGIN WOULD SUCCEED!');
        
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

testExactLogin();
