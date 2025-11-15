const mongoose = require('mongoose');

const testConnection = async () => {
  try {
    const uri =
      'mongodb+srv://sajax84_db_user:<Om3QCVnwOSNxB9GH>@cluster1.x18fwgt.mongodb.net/?appName=Cluster1';

    console.log('🔄 Testing MongoDB connection...');
    await mongoose.connect(uri);
    console.log('✅ MongoDB Connected Successfully!');

    await mongoose.connection.close();
    console.log('✅ Connection closed.');
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  }
};

testConnection();
