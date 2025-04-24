import { eq } from 'drizzle-orm';
import { db } from '../db';
import { refreshTokens } from '../db/schema';

export class TokenModel {
  // Create refresh token
  static async createRefreshToken(data: {
    token: string;
    userId: number;
    expires: Date;
  }) {
    const result = await db
      .insert(refreshTokens)
      .values({
        ...data,
        createdAt: new Date(),
      })
      .returning();
    
    return result.length > 0 ? result[0] : null;
  }

  // Find token by token string
  static async findByToken(token: string) {
    const result = await db
      .select()
      .from(refreshTokens)
      .where(eq(refreshTokens.token, token))
      .limit(1);
    
    return result.length > 0 ? result[0] : null;
  }

  // Delete token
  static async deleteToken(token: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.token, token));
    return true;
  }

  // Delete token by ID
  static async deleteById(id: number) {
    await db.delete(refreshTokens).where(eq(refreshTokens.id, id));
    return true;
  }

  // Delete all tokens for a user
  static async deleteAllForUser(userId: number) {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
    return true;
  }
} 