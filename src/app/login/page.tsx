'use client';

import React, { useState } from 'react';

import { UserContext, User } from '@/app/types/UserContext'; 
import Form from './Form';

export default function Login() {
    const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Form />
    </UserContext.Provider>
  );
}