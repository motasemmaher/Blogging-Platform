import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Post } from '@/lib/types/post';
import { Pagination } from '@/lib/types/api';
// Post context interface
type PostsContextType = {
    posts: Post[];
    setPosts: (posts: Post[]) => void;
    pagination?: Pagination;
    setPagination: (pagination: Pagination) => void;
};

// Create context with default values
const PostsContext = createContext<PostsContextType>({
    posts: [],
    setPosts: () => { },
    pagination: undefined,
    setPagination: () => { }
});

// Props for the posts provider
interface PostsProviderProps {
    children: ReactNode;
    posts: Post[];
    pagination?: Pagination;
}

// Custom provider component
export const PostsProvider: React.FC<PostsProviderProps> = ({ children, posts, pagination }) => {
    const [savedPosts, setPosts] = useState<Post[]>(posts);
    const [savedPagination, setPagination] = useState<Pagination | undefined>(pagination);

    useEffect(() => {
        setPosts(posts);
        setPagination(pagination);
    }, [posts, pagination]);

    return (
        <PostsContext.Provider value={{ posts: savedPosts, setPosts, pagination: savedPagination, setPagination }}>
            {children}
        </PostsContext.Provider>
    );
};

// Custom hook for using the posts context
export const usePosts = () => useContext(PostsContext); 