import mongoose, { Connection } from 'mongoose';
import { messages } from '../utils/constants';

const connectToMongo = async (): Promise<Connection> => {
  try {
    const mongoUri: string = 'mongodb://localhost:27017/reservations?replicaSet=rs0';

    const connection = await mongoose.connect(mongoUri);

    console.log(messages.local.successDbConnect);
    return connection.connection;
  } catch (error) {
    console.log(messages.local.errorDbConnect, error);
    throw error;
  }
};

export default connectToMongo;