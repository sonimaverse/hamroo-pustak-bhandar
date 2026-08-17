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
      // ============================================================
      // 1. ENSURE PERMANENT ADMIN ACCOUNT EXISTS
      // ============================================================

      const adminEmail = 'sonimapokhrel017@gmail.com';
      const adminPassword = 'SonimaAdmin2026';

      const existingAdmin = await User.findOne({
        email: adminEmail.toLowerCase(),
      });

      if (!existingAdmin) {
        console.log('🌱 [MongoDB Seed] Creating permanent administrator...');

        await User.create({
          name: 'Store Administrator',
          email: adminEmail.toLowerCase(),
          password: adminPassword,
          phone: '',
          address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: 'Nepal',
          },
          role: 'admin',
          wholesaleStatus: 'none',
        });

        console.log(
          `✅ [MongoDB Seed] Permanent admin created: ${adminEmail}`
        );
      } else if (existingAdmin.role !== 'admin') {
        existingAdmin.role = 'admin';
        existingAdmin.wholesaleStatus = 'none';
        await existingAdmin.save();

        console.log(
          `✅ [MongoDB Seed] Existing user promoted to admin: ${adminEmail}`
        );
      } else {
        console.log(
          `✅ [MongoDB Seed] Admin already exists: ${adminEmail}`
        );
      }

      // ============================================================
      // 2. ENSURE DEFAULT CATEGORIES EXIST
      // ============================================================

      const categoryCount = await Category.countDocuments();

      if (categoryCount === 0) {
        console.log(
          '🌱 [MongoDB Seed] Seeding default categories in MongoDB...'
        );

        const categoriesData = [
          {
            name: 'Nepali Literature',
            slug: 'nepali-literature',
            description:
              'Classic and modern Nepali novels, poetry, and fiction.',
          },
          {
            name: 'Academic & Textbooks',
            slug: 'academic-textbooks',
            description:
              'Curriculum books for schools, HSEB, and universities in Nepal.',
          },
          {
            name: 'History & Culture',
            slug: 'history-culture',
            description:
              'Books on Nepalese history, heritage, tradition, and social studies.',
          },
          {
            name: 'Self-Help & Biography',
            slug: 'self-help-biography',
            description:
              'Inspirational biographies, personal growth, and leadership.',
          },
        ];

        await Category.insertMany(categoriesData);

        console.log(
          '✅ [MongoDB Seed] Default categories seeded in MongoDB.'
        );
      } else {
        console.log(
          `✅ [MongoDB Seed] Categories already exist (${categoryCount}).`
        );
      }
    } catch (error: any) {
      console.error(
        '⚠️ [MongoDB Seed Error] Seed initialization failed:',
        error.message
      );
    }
  }
}