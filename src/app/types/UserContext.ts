'use client';

import { ReactNode, useState, createContext } from 'react';
import { Book } from './Book';

export type User = {
    user_id: number;
    books: Book[];
  }

export type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  user: null as User | null,
  setUser: (user: User | null) => {}
});

///////////////////////API CALLS

export async function createUser(username: string, password: string, email: string): Promise<number | null> {
  const res = await fetch('http://localhost:3000/api/user', {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: username, password: password, email: email })
  });
  const data = await res.json();
  if (data.code !== 200) {
    return null;
  }
  return data.userId;
}

export async function getUserId(email: string): Promise<number | null> {
  const res = await fetch(`http://localhost:3000/api/user?email=${email}`, {
    method: 'GET',
    cache: 'no-cache',
  });
  const data = await res.json();
  if (data.code !== 200) {
    return null;
  }
  
  return data.userId;
}

export async function loadBooks(user_id: number): Promise<Book[]> {
  const res = await fetch(`http://localhost:3000/api/books?user_id=${user_id}`,
   { method: 'GET', cache: 'no-cache' });
  const data = await res.json();
  if (data.code !== 200) {
      return [];
  }

  return data.books;
}

export async function createBook(book: Book, user: User): Promise<any> {
  const res = await fetch('http://localhost:3000/api/books', {
    method: 'POST',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      key: book.key, 
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      rating: book.rating,
      review: book.review,
      cover: book.coverImage,
      r: book.bgColor[0],
      g: book.bgColor[1],
      b: book.bgColor[2],
      user_id: user.user_id })
  });

  const data = await res.json();
  if (data.code !== 200) {
    return null;
  }
  user.books = [...user.books, book];
  return data;
}

export async function deleteBook(book_id: number, user_id: number): Promise<any> {
  const res = await fetch(`http://localhost:3000/api/books?book_id=${book_id}&user_id=${user_id}`, {
    method: 'DELETE',
    cache: 'no-cache',
  });

  const data = await res.json();
  if (data.code !== 200) {
    return null;
  }
  return data;
}

export async function updateReview(book: Book, user_id: number): Promise<any> {
    const res = await fetch('http://localhost:3000/api/books', {
      method: 'PUT',
      cache: 'no-cache',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        book_id: book.id,
        rating: book.rating,
        review: book.review,
        user_id: user_id
      })
    });
    const data = await res.json();
    if (data.code !== 200) {
      return null;
    }
    return data;
}