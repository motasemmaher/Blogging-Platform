import { eq } from 'drizzle-orm';
import { db } from '../db';
import { users } from '../db/schema';

export class UserModel {
  // Find user by email
  static async findByEmail(email: string) {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

    return result.length > 0 ? result[0] : null;
  }

  // Find user by ID
  static async findById(id: number) {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

    return result.length > 0 ? result[0] : null;
  }

  // Create new user
  static async create(userData: Omit<typeof users.$inferInsert, 'createdAt' | 'updatedAt'>) {
    const result = await db
      .insert(users)
      .values({
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result.length > 0 ? result[0] : null;
  }

  // Update user
  static async update(id: number, userData: Partial<Omit<typeof users.$inferInsert, 'id'>>) {
    const result = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning();

    return result.length > 0 ? result[0] : null;
  }

  // Delete user
  static async delete(id: number) {
    return db.delete(users).where(eq(users.id, id));
  }
}
