require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../src/models/User');
const School = require('../src/models/School');
const Classroom = require('../src/models/Classroom');
const Child = require('../src/models/Child');

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

const recreateDemoData = async () => {
  try {
    await connectDB();

    console.log('\n🔄 Recreating Demo Data in Production...\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany({});
    await School.deleteMany({});
    await Classroom.deleteMany({});
    await Child.deleteMany({});
    console.log('✓ Data cleared');

    // Create school
    console.log('\nCreating school...');
    const school = await School.create({
      name: 'Little Sprouts Academy',
      address: '123 Education Lane',
      city: 'Learning City',
      state: 'CA',
      zipCode: '12345',
      phoneNumber: '+1234567890',
      email: 'info@littlesprouts.com',
      websiteUrl: 'https://littlesprouts.com',
      logoUrl: 'https://via.placeholder.com/200',
      isActive: true,
    });
    console.log('✓ School created:', school.name);

    // Create admin user with proper password hashing
    console.log('\nCreating users...');
    const admin = await User.create({
      email: 'admin@natura.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '+1234567890',
      role: 'admin',
      schoolId: school._id,
      isActive: true,
    });
    console.log('✓ Admin created:', admin.email);

    // Create teacher
    const teacher = await User.create({
      email: 'sarah@natura.com',
      password: 'password123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phoneNumber: '+1234567892',
      role: 'teacher',
      schoolId: school._id,
      isActive: true,
    });
    console.log('✓ Teacher created:', teacher.email);

    // Create parent
    const parent = await User.create({
      email: 'emma.wilson@example.com',
      password: 'password123',
      firstName: 'Emma',
      lastName: 'Wilson',
      phoneNumber: '+1234567894',
      role: 'parent',
      schoolId: school._id,
      isActive: true,
    });
    console.log('✓ Parent created:', parent.email);

    // Create classroom
    console.log('\nCreating classroom...');
    const classroom = await Classroom.create({
      name: 'Sunshine Room',
      schoolId: school._id,
      description: 'A bright and cheerful room for our youngest learners',
      teacherIds: [teacher._id],
      capacity: 15,
      ageGroup: 'Toddlers (1-2 years)',
      roomImageUrl: 'https://via.placeholder.com/400x300',
      isActive: true,
    });
    console.log('✓ Classroom created:', classroom.name);

    // Update teacher with classroom
    teacher.classroomIds = [classroom._id];
    await teacher.save();

    // Create child
    console.log('\nCreating child...');
    const child = await Child.create({
      firstName: 'Lily',
      lastName: 'Wilson',
      dateOfBirth: new Date('2022-03-15'),
      gender: 'female',
      classroomId: classroom._id,
      schoolId: school._id,
      parentIds: [parent._id],
      authorizedPickupIds: [parent._id],
      allergies: 'Peanuts',
      medicalNotes: 'Carries EpiPen',
      emergencyContact: '+1234567894',
      profileImageUrl: 'https://via.placeholder.com/150',
      isActive: true,
      enrollmentDate: new Date('2024-01-15'),
    });
    console.log('✓ Child created:', child.firstName, child.lastName);

    // Update parent with child
    parent.childrenIds = [child._id];
    await parent.save();

    // Update classroom with child
    classroom.childrenIds = [child._id];
    await classroom.save();

    console.log('\n✅ Demo data recreated successfully!');
    console.log('\n🔑 Login Credentials:');
    console.log('Email: admin@natura.com');
    console.log('Password: password123');
    console.log('---');
    console.log('Email: sarah@natura.com');
    console.log('Password: password123');
    console.log('---');
    console.log('Email: emma.wilson@example.com');
    console.log('Password: password123');

  } catch (error) {
    console.error('Error recreating demo data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
};

recreateDemoData();
