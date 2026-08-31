import 'dotenv/config';
import mongoose from 'mongoose';
const url = process.env.MONGO_URL;
for (let i = 1; i <= 8; i++) {
  try {
    await mongoose.connect(url, { serverSelectionTimeoutMS: 8000 });
    console.log('CONNECT_OK on attempt', i);
    await mongoose.connection.close();
    process.exit(0);
  } catch (e) {
    console.log(`attempt ${i} failed: ${e.message.split('\n')[0]}`);
    await new Promise(r => setTimeout(r, 15000));
  }
}
console.log('ALL_ATTEMPTS_FAILED');
process.exit(1);
