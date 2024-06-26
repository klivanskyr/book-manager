'use client';

import { ReactNode, useState, createContext } from 'react';
import { Book } from './Book';

export type User = {
    user_id: string;
    books: Book[] | null;
  }

export type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null as User | null,
  setUser: (user: User | null) => {}
});