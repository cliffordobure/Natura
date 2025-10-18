require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../src/models/User');
const School = require('../src/models/School');
const Classroom = require('../src/models/Classroom');
const Child = require('../src/models/Child');
const Attendance = require('../src/models/Attendance');
const Activity = require('../src/models/Activity');
const Conversation = require('../src/models/Conversation');
const Message = require('../src/models/Message');
const Invoice = require('../src/models/Invoice');
const Payment = require('../src/models/Payment');
const LearningActivity = require('../src/models/LearningActivity');
const Assessment = require('../src/models/Assessment');
const Notification = require('../src/models/Notification');
const Event = require('../src/models/Event');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

// Clear all data
const clearData = async () => {
  console.log('Clearing existing data...');
  await User.deleteMany({});
  await School.deleteMany({});
  await Classroom.deleteMany({});
  await Child.deleteMany({});
  await Attendance.deleteMany({});
  await Activity.deleteMany({});
  await Conversation.deleteMany({});
  await Message.deleteMany({});
  await Invoice.deleteMany({});
  await Payment.deleteMany({});
  await LearningActivity.deleteMany({});
  await Assessment.deleteMany({});
  await Notification.deleteMany({});
  await Event.deleteMany({});
  console.log('Data cleared!');
};

// Seed data
const seedData = async () => {
  try {
    await connectDB();
    await clearData();

    console.log('Creating demo data...\n');

    // ==================== SCHOOLS ====================
    console.log('Creating school...');
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

    // ==================== USERS ====================
    console.log('\nCreating users...');
    
    // Admin
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

    // Director
    const director = await User.create({
      email: 'director@natura.com',
      password: 'password123',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      phoneNumber: '+1234567891',
      role: 'director',
      schoolId: school._id,
      isActive: true,
    });
    console.log('✓ Director created:', director.email);

    // Teachers
    const teacher1 = await User.create({
      email: 'sarah@natura.com',
      password: 'password123',
      firstName: 'Sarah',
      lastName: 'Johnson',
      phoneNumber: '+1234567892',
      role: 'teacher',
      schoolId: school._id,
      isActive: true,
    });
    console.log('✓ Teacher 1 created:', teacher1.email);

    const teacher2 = await User.create({
      email: 'michael@natura.com',
      password: 'password123',
      firstName: 'Michael',
      lastName: 'Brown',
      phoneNumber: '+1234567893',
      role: 'teacher',
      schoolId: school._id,
      isActive: true,
    });
    console.log('✓ Teacher 2 created:', teacher2.email);

    // Parents
    const parent1 = await User.create({
      email: 'emma.wilson@example.com',
      password: 'password123',
      firstName: 'Emma',
      lastName: 'Wilson',
      phoneNumber: '+1234567894',
      role: 'parent',
      schoolId: school._id,
      isActive: true,
    });
    console.log('✓ Parent 1 created:', parent1.email);

    const parent2 = await User.create({
      email: 'david.smith@example.com',
      password: 'password123',
      firstName: 'David',
      lastName: 'Smith',
      phoneNumber: '+1234567895',
      role: 'parent',
      schoolId: school._id,
      isActive: true,
    });
    console.log('✓ Parent 2 created:', parent2.email);

    // ==================== CLASSROOMS ====================
    console.log('\nCreating classrooms...');
    
    const classroom1 = await Classroom.create({
      name: 'Sunshine Room',
      schoolId: school._id,
      description: 'A bright and cheerful room for our youngest learners',
      teacherIds: [teacher1._id],
      capacity: 15,
      ageGroup: 'Toddlers (1-2 years)',
      roomImageUrl: 'https://via.placeholder.com/400x300',
      isActive: true,
    });
    console.log('✓ Classroom created:', classroom1.name);

    const classroom2 = await Classroom.create({
      name: 'Rainbow Room',
      schoolId: school._id,
      description: 'A colorful learning environment for preschoolers',
      teacherIds: [teacher2._id],
      capacity: 18,
      ageGroup: 'Preschool (3-5 years)',
      roomImageUrl: 'https://via.placeholder.com/400x300',
      isActive: true,
    });
    console.log('✓ Classroom created:', classroom2.name);

    // Update teachers with classroom IDs
    teacher1.classroomIds = [classroom1._id];
    await teacher1.save();
    teacher2.classroomIds = [classroom2._id];
    await teacher2.save();

    // Update school with director and classrooms
    school.directorId = director._id;
    school.classroomIds = [classroom1._id, classroom2._id];
    await school.save();

    // ==================== CHILDREN ====================
    console.log('\nCreating children...');
    
    const child1 = await Child.create({
      firstName: 'Lily',
      lastName: 'Wilson',
      dateOfBirth: new Date('2022-03-15'),
      gender: 'female',
      classroomId: classroom1._id,
      schoolId: school._id,
      parentIds: [parent1._id],
      authorizedPickupIds: [parent1._id],
      allergies: 'Peanuts',
      medicalNotes: 'Carries EpiPen',
      emergencyContact: '+1234567894',
      profileImageUrl: 'https://via.placeholder.com/150',
      isActive: true,
      enrollmentDate: new Date('2024-01-15'),
    });
    console.log('✓ Child created:', child1.firstName, child1.lastName);

    const child2 = await Child.create({
      firstName: 'Liam',
      lastName: 'Smith',
      dateOfBirth: new Date('2021-08-22'),
      gender: 'male',
      classroomId: classroom2._id,
      schoolId: school._id,
      parentIds: [parent2._id],
      authorizedPickupIds: [parent2._id],
      allergies: '',
      medicalNotes: '',
      emergencyContact: '+1234567895',
      profileImageUrl: 'https://via.placeholder.com/150',
      isActive: true,
      enrollmentDate: new Date('2024-02-01'),
    });
    console.log('✓ Child created:', child2.firstName, child2.lastName);

    // Update parents with children IDs
    parent1.childrenIds = [child1._id];
    await parent1.save();
    parent2.childrenIds = [child2._id];
    await parent2.save();

    // Update classrooms with children
    classroom1.childrenIds = [child1._id];
    await classroom1.save();
    classroom2.childrenIds = [child2._id];
    await classroom2.save();

    // ==================== ATTENDANCE ====================
    console.log('\nCreating attendance records...');
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance1 = await Attendance.create({
      childId: child1._id,
      classroomId: classroom1._id,
      date: today,
      checkInTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 30),
      checkInBy: teacher1._id,
      checkInNotes: 'Happy and ready to play!',
      status: 'checkedIn',
      temperature: 98.6,
      mood: 'Happy',
    });
    console.log('✓ Attendance created for', child1.firstName);

    const attendance2 = await Attendance.create({
      childId: child2._id,
      classroomId: classroom2._id,
      date: today,
      checkInTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
      checkInBy: teacher2._id,
      checkInNotes: 'Excited about today\'s activities',
      status: 'checkedIn',
      temperature: 98.4,
      mood: 'Excited',
    });
    console.log('✓ Attendance created for', child2.firstName);

    // ==================== ACTIVITIES ====================
    console.log('\nCreating activities...');
    
    const activity1 = await Activity.create({
      childId: child1._id,
      classroomId: classroom1._id,
      teacherId: teacher1._id,
      type: 'art',
      timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 0),
      title: 'Finger Painting Fun',
      description: 'Lily had a blast creating colorful finger paintings today! She mixed red and blue to make purple.',
      mediaUrls: ['https://via.placeholder.com/400x300'],
      isSharedWithParents: true,
    });
    console.log('✓ Activity created:', activity1.title);

    const activity2 = await Activity.create({
      childId: child2._id,
      classroomId: classroom2._id,
      teacherId: teacher2._id,
      type: 'learning',
      timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 30),
      title: 'Counting with Blocks',
      description: 'Liam practiced counting from 1 to 10 using colorful building blocks. He\'s getting really good at it!',
      mediaUrls: ['https://via.placeholder.com/400x300'],
      isSharedWithParents: true,
    });
    console.log('✓ Activity created:', activity2.title);

    const activity3 = await Activity.create({
      childId: child1._id,
      classroomId: classroom1._id,
      teacherId: teacher1._id,
      type: 'meal',
      timestamp: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 12, 0),
      title: 'Lunch Time',
      description: 'Lily ate most of her lunch today!',
      metadata: {
        mealType: 'lunch',
        amount: 'most',
        foodItems: ['Chicken nuggets', 'Apple slices', 'Carrots'],
      },
      isSharedWithParents: true,
    });
    console.log('✓ Activity created:', activity3.title);

    // ==================== CONVERSATIONS & MESSAGES ====================
    console.log('\nCreating conversations and messages...');
    
    const conversation1 = await Conversation.create({
      participantIds: [parent1._id, teacher1._id],
      childId: child1._id,
      classroomId: classroom1._id,
      title: 'Lily\'s Progress',
    });

    const message1 = await Message.create({
      conversationId: conversation1._id,
      senderId: teacher1._id,
      recipientId: parent1._id,
      type: 'text',
      content: 'Lily had a wonderful day today! She really enjoyed finger painting and was very creative with colors.',
      timestamp: new Date(),
      isRead: false,
    });

    conversation1.lastMessageId = message1._id;
    await conversation1.save();
    console.log('✓ Conversation and message created');

    // ==================== INVOICES ====================
    console.log('\nCreating invoices...');
    
    const invoice1 = await Invoice.create({
      parentId: parent1._id,
      childId: child1._id,
      schoolId: school._id,
      invoiceDate: new Date('2024-02-01'),
      dueDate: new Date('2024-02-15'),
      amount: 1200.00,
      paidAmount: 1200.00,
      status: 'paid',
      items: [
        {
          description: 'Monthly Tuition - Lily Wilson',
          quantity: 1,
          unitPrice: 1000.00,
          total: 1000.00,
        },
        {
          description: 'Activity Fee',
          quantity: 1,
          unitPrice: 200.00,
          total: 200.00,
        },
      ],
      notes: 'Thank you for your payment!',
      paidAt: new Date('2024-02-10'),
    });
    console.log('✓ Invoice created (PAID)');

    const invoice2 = await Invoice.create({
      parentId: parent2._id,
      childId: child2._id,
      schoolId: school._id,
      invoiceDate: new Date('2024-03-01'),
      dueDate: new Date('2024-03-15'),
      amount: 1200.00,
      paidAmount: 0.00,
      status: 'pending',
      items: [
        {
          description: 'Monthly Tuition - Liam Smith',
          quantity: 1,
          unitPrice: 1000.00,
          total: 1000.00,
        },
        {
          description: 'Activity Fee',
          quantity: 1,
          unitPrice: 200.00,
          total: 200.00,
        },
      ],
      notes: 'Monthly tuition for March 2024',
    });
    console.log('✓ Invoice created (PENDING)');

    // ==================== PAYMENTS ====================
    console.log('\nCreating payment records...');
    
    const payment1 = await Payment.create({
      invoiceId: invoice1._id,
      parentId: parent1._id,
      amount: 1200.00,
      method: 'creditCard',
      transactionId: 'txn_' + Date.now(),
      paymentDate: new Date('2024-02-10'),
      notes: 'Payment via credit card',
    });
    console.log('✓ Payment created');

    // ==================== LEARNING ACTIVITIES ====================
    console.log('\nCreating learning activities...');
    
    await LearningActivity.create({
      title: 'Color Recognition',
      description: 'Learning to identify and name basic colors',
      domain: 'cognitive',
      ageGroup: 'Toddlers (1-2 years)',
      objectives: ['Identify primary colors', 'Name colors correctly', 'Match objects by color'],
      instructions: 'Use various colored materials to help children learn color names',
      materialNeeded: ['colored blocks', 'paint', 'crayons'],
      durationMinutes: 30,
      createdBy: teacher1._id,
    });

    await LearningActivity.create({
      title: 'Number Recognition 1-10',
      description: 'Learning to identify and count numbers 1-10',
      domain: 'cognitive',
      ageGroup: 'Preschool (3-5 years)',
      objectives: ['Recognize numbers 1-10', 'Count objects accurately', 'Understand number sequence'],
      instructions: 'Use visual aids to teach number recognition and counting',
      materialNeeded: ['number blocks', 'counting books', 'number cards'],
      durationMinutes: 45,
      createdBy: teacher2._id,
    });
    console.log('✓ Learning activities created');

    // ==================== ASSESSMENTS ====================
    console.log('\nCreating assessments...');
    
    await Assessment.create({
      childId: child1._id,
      teacherId: teacher1._id,
      classroomId: classroom1._id,
      assessmentDate: new Date(),
      skillName: 'Recognizes primary colors',
      domain: 'cognitive',
      level: 'emerging',
      notes: 'Lily is beginning to identify red, yellow, and blue consistently',
      mediaUrls: [],
    });
    console.log('✓ Assessment created');

    // ==================== NOTIFICATIONS ====================
    console.log('\nCreating notifications...');
    
    await Notification.create({
      userId: parent1._id,
      type: 'activity',
      title: 'New Activity Update',
      body: 'Lily had a wonderful time with finger painting today!',
      data: {
        childId: child1._id,
        activityId: activity1._id,
      },
      isRead: false,
      timestamp: new Date(),
    });

    await Notification.create({
      userId: parent2._id,
      type: 'payment',
      title: 'Payment Reminder',
      body: 'Your payment for March tuition is due on 2024-03-15',
      data: {
        invoiceId: invoice2._id,
        amount: 1200.00,
      },
      isRead: false,
      timestamp: new Date(),
    });
    console.log('✓ Notifications created');

    // ==================== EVENTS ====================
    console.log('\nCreating calendar events...');
    
    await Event.create({
      schoolId: school._id,
      title: 'Parent-Teacher Conference',
      description: 'Scheduled parent-teacher conferences for all families',
      type: 'parentTeacherConference',
      startDate: new Date('2024-03-15T09:00:00Z'),
      endDate: new Date('2024-03-15T17:00:00Z'),
      isAllDay: false,
      location: 'Little Sprouts Academy',
      attendeeIds: [parent1._id, parent2._id, teacher1._id, teacher2._id],
      createdBy: director._id,
      color: '#4CAF50',
    });

    await Event.create({
      schoolId: school._id,
      title: 'Spring Break',
      description: 'School will be closed for spring break',
      type: 'holiday',
      startDate: new Date('2024-03-25T00:00:00Z'),
      endDate: new Date('2024-03-29T23:59:59Z'),
      isAllDay: true,
      location: 'Little Sprouts Academy',
      attendeeIds: [],
      createdBy: director._id,
      color: '#FF9800',
    });
    console.log('✓ Events created');

    console.log('\n✅ Demo data created successfully!\n');
    console.log('='.repeat(50));
    console.log('LOGIN CREDENTIALS:');
    console.log('='.repeat(50));
    console.log('\n👤 ADMIN:');
    console.log('   Email: admin@natura.com');
    console.log('   Password: password123');
    console.log('\n👤 DIRECTOR:');
    console.log('   Email: director@natura.com');
    console.log('   Password: password123');
    console.log('\n👨‍🏫 TEACHERS:');
    console.log('   Email: sarah@natura.com');
    console.log('   Password: password123');
    console.log('   ---');
    console.log('   Email: michael@natura.com');
    console.log('   Password: password123');
    console.log('\n👨‍👩‍👧 PARENTS:');
    console.log('   Email: emma.wilson@example.com');
    console.log('   Password: password123');
    console.log('   ---');
    console.log('   Email: david.smith@example.com');
    console.log('   Password: password123');
    console.log('\n' + '='.repeat(50));
    console.log('\n🎉 You can now login with any of these accounts!');
    console.log('\n📝 Summary:');
    console.log('   - 1 School: Little Sprouts Academy');
    console.log('   - 2 Classrooms: Sunshine Room, Rainbow Room');
    console.log('   - 6 Users: 1 Admin, 1 Director, 2 Teachers, 2 Parents');
    console.log('   - 2 Children: Lily Wilson, Liam Smith');
    console.log('   - Attendance, Activities, Messages, Invoices, and more!');
    console.log('\n');

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

// Run the seed
seedData();


