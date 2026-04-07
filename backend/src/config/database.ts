import { connect } from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    await connect(mongoURI);
    console.log('Connected to DB');
  } catch (error) {
    console.error(error);
    // Exit process with failure
    process.exit(1);
  }
};
