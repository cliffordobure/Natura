// Test if all modules can be loaded without syntax errors

console.log('Testing module imports...');

try {
  console.log('✓ Loading authController...');
  const authController = require('../src/controllers/authController');
  console.log('✓ authController loaded successfully');
  
  console.log('✓ Loading server...');
  const server = require('../src/server');
  console.log('✓ Server loaded successfully');
  
  console.log('\n🎉 All modules loaded successfully!');
  console.log('✅ Your server should deploy without syntax errors now!');
  
} catch (error) {
  console.error('❌ Error loading modules:', error.message);
  process.exit(1);
}
