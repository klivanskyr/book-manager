'use client' 

import { useState  } from 'react';
import { User, UserContext } from '@/types/UserContext';

export function ParentProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )

}