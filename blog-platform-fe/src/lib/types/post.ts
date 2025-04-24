import { User } from "./user";

export interface Post {
    id?: number;
    title: string;
    content: string;
    published: boolean;
    categoryIds: string[];
    author: User;
    createdAt: string;
    updatedAt: string;
  }