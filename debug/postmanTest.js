// This script shows you the EXACT request format for Postman

console.log('📋 POSTMAN REQUEST FORMAT');
console.log('========================\n');

console.log('🌐 URL:');
console.log('POST https://natura-fu5m.onrender.com/api/v1/auth/login\n');

console.log('📋 Headers:');
console.log('Content-Type: application/json\n');

console.log('📝 Body (raw JSON):');
console.log(JSON.stringify({
  "email": "admin@natura.com",
  "password": "password123"
}, null, 2));

console.log('\n🔑 WORKING CREDENTIALS:');
console.log('======================');

const credentials = [
  { role: 'Admin', email: 'admin@natura.com', password: 'password123' },
  { role: 'Teacher', email: 'sarah@natura.com', password: 'password123' },
  { role: 'Parent', email: 'emma.wilson@example.com', password: 'password123' }
];

credentials.forEach((cred, index) => {
  console.log(`\n${index + 1}. ${cred.role}:`);
  console.log(`   Email: "${cred.email}"`);
  console.log(`   Password: "${cred.password}"`);
});

console.log('\n⚠️  IMPORTANT NOTES:');
console.log('===================');
console.log('1. Make sure there are NO extra spaces in the email');
console.log('2. Make sure the password is exactly "password123"');
console.log('3. Make sure you\'re using POST method');
console.log('4. Make sure Content-Type is application/json');
console.log('5. Make sure you\'re hitting the correct URL');

console.log('\n🧪 TEST THIS EXACT REQUEST IN POSTMAN:');
console.log('=====================================');
console.log('Method: POST');
console.log('URL: https://natura-fu5m.onrender.com/api/v1/auth/login');
console.log('Headers: Content-Type: application/json');
console.log('Body: { "email": "admin@natura.com", "password": "password123" }');
