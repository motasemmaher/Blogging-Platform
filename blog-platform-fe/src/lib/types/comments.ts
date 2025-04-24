import { User } from "./user";

// Shared Comment interface
export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: User;
}

export interface MessageResponse {
    error: string;
    status: number;
}

export interface MessageError extends Error {
    status: number;
    response: {
        data: MessageResponse;
    };
}

export interface MessageErrorSSR extends Error {
    status: number;
    response: {
        data: {
            message: string;
            statusCode: number;
        };
    };
}