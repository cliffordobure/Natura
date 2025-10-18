require('dotenv').config();
const mongoose = require('mongoose');

const testApiLogin = async () => {
  try {
    console.log('\n🧪 Testing API Login Endpoint...\n');
    
    const testData = {
      email: 'admin@natura.com',
      password: 'password123'
    };

    // Make actual HTTP request to your API
    const response = await fetch('https://natura-fu5m.onrender.com/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });

    console.log(`Status: ${response.status} ${response.statusText}`);
    
    const responseData = await response.text();
    console.log('Response:', responseData);

    if (response.ok) {
      console.log('🎉 API Login successful!');
      const data = JSON.parse(responseData);
      console.log('Token received:', data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ API Login failed');
    }

  } catch (error) {
    console.error('Error testing API:', error.message);
  }
};

testApiLogin();
