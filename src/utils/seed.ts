import User from '@/models/User';
import connectDB from '@/utils/db';

const defaultUsers = [
  {
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin'
  },
  {
    email: 'user1@example.com',
    password: 'user123',
    name: 'User One',
    role: 'user'
  },
  // Diğer kullanıcıları da ekleyin
];

export async function seedUsers() {
  try {
    await connectDB();
    
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create(defaultUsers);
      console.log('Default users created successfully');
    }
  } catch (error) {
    console.error('Error seeding users:', error);
  }
} 