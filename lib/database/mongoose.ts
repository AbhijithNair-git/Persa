// Remove eslint-disable for @typescript-eslint/no-explicit-any as it is no longer needed
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URL = process.env.MONGODB_URL;

// Removed MongooseConnection interface as it is not used anywhere
// interface MongooseConnection {
//   conn: Mongoose | null;
//   promise: Promise<Mongoose> | null;
// }

let cached: { conn: Mongoose | null, promise: Promise<Mongoose> | null } = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { 
    conn: null, promise: null 
  };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error('Missing MONGODB_URL');

  cached.promise = 
    cached.promise || 
    mongoose.connect(MONGODB_URL, { 
      dbName: 'Persa', bufferCommands: false 
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
