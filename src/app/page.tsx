'use client';

import React, { useState } from 'react';

import { UserContext, User } from '@/app/types/UserContext'; 
import Manager from './Manager';

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  if (!user) {
    //redirect to login page

  }
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Manager />
    </UserContext.Provider>
  );
}