import { eq } from 'drizzle-orm';
import { db } from '../db';
import { comments, users } from '../db/schema';

export class CommentModel {
  // Get all comments for a post
  static async findByPostId(postId: number) {
    return db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(comments)
      .where(eq(comments.postId, postId))
      .leftJoin(users, eq(comments.authorId, users.id))
      .orderBy(comments.createdAt);
  }

  // Create new comment
  static async create(commentData: {
    content: string;
    postId: number;
    authorId: number;  // Using authorId to match the schema definition
  }) {
    const result = await db
      .insert(comments)
      .values({
        ...commentData,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();
    
    return result.length > 0 ? this.findById(result[0].id) : null;
  }

  // Delete comment
  static async delete(commentId: number) {
    await db.delete(comments).where(eq(comments.id, commentId));
    return true;
  }

  static async findById(commentId: number) {
    const result = await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(comments)
      .where(eq(comments.id, commentId))
      .leftJoin(users, eq(comments.authorId, users.id))
    
    return result.length > 0 ? result[0] : null;
  }
} 