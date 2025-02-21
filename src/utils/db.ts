import mongoose from 'mongoose';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  // Development ortamında hata fırlatmak yerine console.warn kullanalım
  if (process.env.NODE_ENV === 'development') {
    console.warn('MongoDB URI is not defined in environment variables.');
  }
  // Production'da sessizce devam edelim
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts = {
      bufferCommands: false,
    };
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    cached = global.mongoose = { conn: null, promise: mongoose.connect(MONGODB_URI, opts) };
  }

  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    cached.conn = await cached.promise;
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    cached.promise = null;
    throw e;
  }

  return cached?.conn;
}

export default connectDB; 