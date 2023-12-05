import mongoose, { Connection } from 'mongoose';

const connectToMongo = async (): Promise<Connection> => {
  try {
    const mongoUri: string = 'mongodb://localhost:27017/reservations?replicaSet=rs0';

    const connection = await mongoose.connect(mongoUri);

    console.log('Connected to MongoDB');
    return connection.connection;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
};

export default connectToMongo;