import { MetadataRoute } from 'next';
import { postsApi } from '@/lib/api/posts';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get posts for the sitemap
    const { posts } = await postsApi.getPosts(1, 100); // First 100 posts
    
    // Base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    // Create sitemap entries for posts
    const postEntries = posts.map((post) => ({
      url: `${baseUrl}/posts/${post.id}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
    
    // Add static pages
    const staticPages = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/posts`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ];
    
    return [...staticPages, ...postEntries];
  } catch (error) {
    // Fallback to static pages only if API call fails
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || '';
    
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/posts`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
    ];
  }
} 