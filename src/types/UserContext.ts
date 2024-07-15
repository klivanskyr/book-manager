'use client';

import { createContext } from 'react';
import { Shelf } from './Shelf';

export type User = {
    userId: string;
    shelves: Shelf[];
  }

export type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null as User | null,
  setUser: (user: User | null) => {}
});