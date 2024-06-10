'use client';

import React, { useState } from 'react';

import { UserContext, User } from './UserContext'; 
import Header from './Header';
import Manager from './Manager';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header />
      <Manager />
    </UserContext.Provider>
  );
}