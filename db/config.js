import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectToDatabase = async () => {
  let dbName = 'real_estate'
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName,
    });

    console.log('Connected to the MongoDB database');
  } catch (error) {
    console.error('Error connecting to the MongoDB database:', error.message);

    // Shut down the application upon a connection error
    console.error('Shutting down the application');
    process.exit(1); // Exit with a non-zero code to indicate an error
  }
};

export default connectToDatabase;