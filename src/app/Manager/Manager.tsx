'use client';

import { useState, useEffect, ReactElement } from 'react';
import Search from './Search'
import Shelf from './Shelf'
import { Book } from './Book'

import { prisma } from '../../../lib/prisma'

async function getNames(): Promise<string[]> {
  const names = await prisma.user.findMany({
    select: {
      username: true
    }
  })
  return names.map((name) => name.username);
}



export function booksToLocalStorage(books: Book[]): void {
  localStorage.setItem('books', JSON.stringify(books));
  window.dispatchEvent(new Event('storage'));
}

function loadBooks(): Book[] {
  if (typeof window !== 'undefined') {
    const res = localStorage.getItem('books');
    return res ? JSON.parse(res) : [];
  }
  return [];
}

export default function Manager(): ReactElement {
  const [books, setBooks] = useState<Book[]>(loadBooks());

  // Fetch books from local storage on startup
  useEffect(() => {
    setBooks(loadBooks());
  }, []);

  // Update state when local storage changes
  useEffect(() => {
    function handleStorageChange(): void {
      setBooks(loadBooks());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div className='flex flex-col items-center h-auto'>
      <Search books={books} />
      <Shelf books={books} />
    </div>
  )
}