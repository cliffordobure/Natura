require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');
const School = require('../src/models/School');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

const checkDatabase = async () => {
  try {
    await connectDB();

    console.log('\n🔍 Checking Database...\n');

    // Check schools
    const schools = await School.find();
    console.log('📚 Schools:', schools.length);
    schools.forEach(school => {
      console.log(`  - ${school.name} (ID: ${school._id})`);
    });

    // Check users
    const users = await User.find();
    console.log('\n👥 Users:', users.length);
    users.forEach(user => {
      console.log(`  - ${user.email} (Role: ${user.role}, Active: ${user.isActive}, SchoolID: ${user.schoolId})`);
    });

    // Check specific login credentials
    console.log('\n🔑 Testing Login Credentials...\n');
    
    const testEmails = [
      'admin@natura.com',
      'emma.wilson@example.com',
      'sarah@natura.com'
    ];

    for (const email of testEmails) {
      const user = await User.findOne({ email });
      if (user) {
        console.log(`✅ Found user: ${email}`);
        console.log(`   - Role: ${user.role}`);
        console.log(`   - Active: ${user.isActive}`);
        console.log(`   - School ID: ${user.schoolId}`);
        console.log(`   - Has password: ${user.password ? 'Yes' : 'No'}`);
      } else {
        console.log(`❌ User not found: ${email}`);
      }
    }

    // Check if JWT_SECRET is set
    console.log('\n🔐 Environment Variables...');
    console.log(`JWT_SECRET set: ${process.env.JWT_SECRET ? 'Yes' : 'No'}`);
    console.log(`JWT_REFRESH_SECRET set: ${process.env.JWT_REFRESH_SECRET ? 'Yes' : 'No'}`);
    console.log(`MONGODB_URI set: ${process.env.MONGODB_URI ? 'Yes' : 'No'}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

checkDatabase();
