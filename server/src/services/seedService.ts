import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { getDbStatus } from '../config/db.js';

export class SeedService {
  public static async seedInitialData(): Promise<void> {
    const dbState = getDbStatus();
    if (dbState.mode !== 'mongodb_atlas' || !dbState.isConnected) {
      return;
    }

    try {
      // 1. Ensure Store Administrator exists in MongoDB Atlas
      const adminCount = await User.countDocuments({ role: 'admin' });
      if (adminCount === 0) {
        console.log('🌱 [MongoDB Seed] Creating initial store administrator account in MongoDB...');
        await User.create({
          name: 'Store Administrator',
          email: 'admin@hamropustak.com',
          password: 'Password123!', // Mongoose pre-save hook will hash this securely
          phone: '+977-9823456789',
          address: {
            street: 'Thamel',
            city: 'Kathmandu',
            state: 'Bagmati',
            postalCode: '44600',
            country: 'Nepal',
          },
          role: 'admin',
          wholesaleStatus: 'none',
        });
        console.log('✅ [MongoDB Seed] Initial store administrator created in MongoDB.');
      }

      // 2. Ensure default categories exist in MongoDB Atlas if empty
      const categoryCount = await Category.countDocuments();
      if (categoryCount === 0) {
        console.log('🌱 [MongoDB Seed] Seeding default categories in MongoDB...');
        const categoriesData = [
          { name: 'Nepali Literature', slug: 'nepali-literature', description: 'Classic and modern Nepali novels, poetry, and fiction.' },
          { name: 'Academic & Textbooks', slug: 'academic-textbooks', description: 'Curriculum books for schools, HSEB, and universities in Nepal.' },
          { name: 'History & Culture', slug: 'history-culture', description: 'Books on Nepalese history, heritage, tradition, and social studies.' },
          { name: 'Self-Help & Biography', slug: 'self-help-biography', description: 'Inspirational biographies, personal growth, and leadership.' },
        ];
        await Category.insertMany(categoriesData);
        console.log('✅ [MongoDB Seed] Default categories seeded in MongoDB.');
      }
    } catch (error: any) {
      console.error('⚠️ [MongoDB Seed Error] Seed initialization skipped:', error.message);
    }
  }
}
