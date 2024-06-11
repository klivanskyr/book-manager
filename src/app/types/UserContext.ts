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

///////////////////////////////////////////////////////


//Used for updating book background loaded. DONT RELOAD
// export function updateBook(user: User, book: Book): void {
//     const updatedBooks = user.books.map((elt) => {
//         if (elt.id === book.id) {
//           return book;
//         }
//           return elt;
//     });
//     user.books = updatedBooks;
//     console.log(user.books);
// }


///////////////////////API CALLS

export async function createUser(username: string, password: string, email: string): Promise<number | null> {
  const res = await fetch(`http://localhost:3000/api/user?username=${username}&password=${password}&email=${email}`,
   { method: 'POST', cache: 'no-cache' });
  const data = await res.json();
  if (data.code !== 200) {
    console.log(data.message);
    return null;
  }
  return data.userId;
}

export async function getUserId(email: string): Promise<number | null> {
  const res = await fetch(`http://localhost:3000/api/user?email=${email}`,
   { method: 'GET', cache: 'no-cache' });
  const data = await res.json();
  console.log('\n\n', data, '\n\n');
  if (data.code !== 200) {
    console.log(data.message);
    return null;
  }
  
  return data.userId;
}

export async function loadBooks(user_id: number): Promise<Book[]> {
    const res = await fetch(`http://localhost:3000/api/books?user_id=${user_id}`,
     { method: 'GET', cache: 'no-cache' });
    const data = await res.json();
    if (data.code !== 200) {
        console.log(data.message);
        return [];
    }

    return data.books;
}

export async function createBook(book: Book, user: User): Promise<any> {
  const key = book.key;
  const title = book.title;
  const author = book.author;
  const isbn = book.isbn;
  const rating = book.rating;
  const review = book.review;
  const cover = book.coverImage;
  const r = book.bgColor[0];
  const g = book.bgColor[1];
  const b = book.bgColor[2];
  const res = await fetch(`http://localhost:3000/api/books?key=${key}&title=${title}&author=${author}&isbn=${isbn}&rating=${rating}&review=${review}&cover=${cover}&r=${r}&g=${g}&b=${b}&user_id=${user.user_id}`,
    { method: 'POST', cache: 'no-cache' });
  const data = await res.json();
  if (data.code !== 200) {
    console.log(data.message);
    return null;
  }
  user.books = [...user.books, book];
  return data;
}

export async function deleteBook(book_id: number, user_id: number): Promise<any> {
    const res = await fetch(`http://localhost:3000/api/books?book_id=${book_id}&user_id=${user_id}`,
     { method: 'DELETE', cache: 'no-cache' });
    const data = await res.json();
    if (data.code !== 200) {
      console.log(data.message);
      return null;
    }
    return data;
}

export async function updateReview(book: Book, user_id: number): Promise<any> {
    const book_id = book.id;
    const rating = book.rating;
    const review = book.review;
    const res = await fetch(`http://localhost:3000/api/books?book_id=${book_id}&rating=${rating}&review=${review}&user_id=${user_id}`,
     { method: 'PUT', cache: 'no-cache' });
    const data = await res.json();
    if (data.code !== 200) {
      console.log(data.message);
      return null;
    }
    return data;
}