import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Comment } from '@/lib/types/comments';

// Comment context interface
type CommentsContextType = {
    comments: Comment[];
    setComments: (comments: Comment[]) => void;
};

// Create context with default values
const CommentsContext = createContext<CommentsContextType>({
    comments: [],
    setComments: () => { }
});

// Props for the comments provider
interface CommentsProviderProps {
    children: ReactNode;
    comments: Comment[];
}

// Custom provider component
export const CommentsProvider: React.FC<CommentsProviderProps> = ({ children, comments }) => {
    const [savedComments, setComments] = useState<Comment[]>(comments);
    return (
        <CommentsContext.Provider value={{ comments: savedComments, setComments }}>
            {children}
        </CommentsContext.Provider>
    );
};

// Custom hook for using the comments context
export const useComments = () => useContext(CommentsContext); 