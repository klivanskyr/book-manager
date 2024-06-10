'use client' 

import { useState  } from 'react';
import { User, UserContext } from '@/app/types/UserContext';

function ContextWrapper(PageComponent: React.ComponentType<any>): React.ComponentType<any> {
    return function WrappedComponent(props: any): React.ReactElement {
        const [user, setUser] = useState<User | null>(null);

        return (
            <UserContext.Provider value={{ user, setUser }}>
                <PageComponent {...props} />
            </UserContext.Provider>
        );
    };
}

export default ContextWrapper;

export function ParentProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )

}