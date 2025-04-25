import { eq, and, desc, sql, like, ne, or } from 'drizzle-orm';
import { db } from '../db';
import { posts, users } from '../db/schema';

export class PostModel {
  // Get all posts with pagination
  static async findAll(page: number = 1, limit: number = 10, search: string = '', userId?: number) {
    const offset = (page - 1) * limit;

    const allPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(
        and(
          search ? like(posts.title, `%${search}%`) : undefined,
          or(
            and(userId ? ne(posts.authorId, userId) : undefined, eq(posts.published, true)),
            and(userId ? eq(posts.authorId, userId) : undefined)
          )
        )
      )
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);

    // Count total posts for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(posts)
      .where(search ? like(posts.title, `%${search}%`) : undefined);

    const totalPosts = countResult[0]?.count || 0;
    const totalPages = Math.ceil(totalPosts / limit);

    return {
      posts: allPosts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages,
      },
    };
  }

  // Get post by ID with author and categories
  static async findById(postId: number) {
    const postData = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        published: posts.published,
        createdAt: posts.createdAt,
        updatedAt: posts.updatedAt,
        author: {
          id: users.id,
          name: users.name,
          email: users.email,
        },
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, postId))
      .limit(1);

    return postData[0] ? postData[0] : null;
  }

  // Create new post
  static async create(postData: {
    title: string;
    content: string;
    published?: boolean;
    authorId: number;
  }) {
    const result = await db
      .insert(posts)
      .values({
        ...postData,
        published: postData.published || false,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return result.length > 0 ? result[0] : null;
  }

  // Update post
  static async update(
    postId: number,
    userId: number,
    updateData: Partial<Omit<typeof posts.$inferInsert, 'id' | 'authorId'>>
  ) {
    // Check if post exists and belongs to user
    const existingPost = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, postId), eq(posts.authorId, userId)))
      .limit(1);

    if (existingPost.length === 0) {
      return null;
    }

    const result = await db
      .update(posts)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(posts.id, postId))
      .returning();

    return result.length > 0 ? result[0] : null;
  }

  // Delete post
  static async delete(postId: number, userId: number) {
    // Check if post exists and belongs to user
    const existingPost = await db
      .select()
      .from(posts)
      .where(and(eq(posts.id, postId), eq(posts.authorId, userId)))
      .limit(1);

    if (existingPost.length === 0) {
      return false;
    }

    // Delete post (cascade will handle related records)
    await db.delete(posts).where(eq(posts.id, postId));
    return true;
  }
}
