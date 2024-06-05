import { useState, useEffect, ReactElement } from 'react';
import Search from './Search'
import Shelf from './Shelf'
import { Book } from './Book'

import { prisma } from '../../../lib/prisma'
import { BsSignRailroad } from 'react-icons/bs';

const EMAIL = 'test@test.com';

async function getBooks(): Promise<Book[]> {
  
  // Find the user by username
  const user = await prisma.user.findUnique({
    where: {
      email: EMAIL
    }
  });

  // If the user is not found, return an empty array
  if (!user) {
    return [];
  }

  // Use the user's ID in the subsequent query
  const userWithBooks = await prisma.user.findFirst({
    where: {
      id: user.id
    },
    include: {
      User_book: {
        include: {
          Book: {
            include: {
              Review: {
                where: {
                  userId: user.id, // Use the user's ID here
                },
              },
            },
          },
        },
      },
    },
  });

  
  const bookObjects = userWithBooks ? userWithBooks?.User_book.map((userBook) => userBook.Book) : [];
  const books = bookObjects?.map((elt) => {
    return {
      key: elt.key,
      title: elt.title,
      author: elt.author,
      review: elt.Review[0]?.review,
      rating: elt.Review[0]?.rating,
      isbn: elt.isbn.toString(),
      coverImage: '',
      bgColor: [127, 127, 127], //default
      bgLoaded: false,
      imgLoaded: false,
      selected: true //true because it is in the database
    };
  });
  console.log('books', books)
  return books;
}

export function booksToLocalStorage(books: Book[]): void {
  localStorage.setItem('books', JSON.stringify(books));
  window.dispatchEvent(new Event('storage'));
}

// function loadBooks(): Book[] {
//   if (typeof window !== 'undefined') {
//     const res = localStorage.getItem('books');
//     return res ? JSON.parse(res) : [];
//   }
//   return [];
// }

export default function Manager(): ReactElement {
  // const [books, setBooks] = useState<Book[]>(loadBooks());

  // Fetch books from local storage on startup
  // useEffect(() => {
  //   setBooks(loadBooks());
  // }, []);

  // Update state when local storage changes
  // useEffect(() => {
  //   function handleStorageChange(): void {
  //     setBooks(loadBooks());
  //   };

  //   window.addEventListener('storage', handleStorageChange);
  //   return () => window.removeEventListener('storage', handleStorageChange);
  // }, []);

  const books = getBooks();
  console.log(books);
  return (
    <div className='flex flex-col items-center h-auto'>
      <Search books={books} />
      <Shelf books={books} />
    </div>
  )
}