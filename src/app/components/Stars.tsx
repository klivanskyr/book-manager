'use client';

import React, { useContext } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { Book } from '@/app/types/Book';
import { UserContext } from '@/app/types/UserContext';
import { updateUserBook } from '@/firebase/firestore';

export default function Stars({ size, book }: { size: number, book: Book }) {
  const { user, setUser } = useContext(UserContext);

  // Update star/rating amount
  async function handleRatingUpdate(book: Book, starIndex: number): Promise<void> {
    if (user && user.books) {
      const isResetRating = book.rating === starIndex + 1; // Reset rating if the same star is clicked
      const newBook = { ...book, rating: isResetRating ? 0 : starIndex + 1 };
      await updateUserBook(newBook, user.user_id);
      setUser({ ...user, books: user.books.map(b => b.id === book.bookId ? newBook : b) });
    }
  }

  return (
    <div className='flex flex-row justify-center text-center pb-2'>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.1 }}
          >
            <FaStar 
                key={i} 
                color={i < book.rating ? '#01af93' : '#bbbbbb'} 
                onClick={() => handleRatingUpdate(book, i)}
                size={size}
                className='mt-2'
            />
          </motion.div>
        ))}
    </div>
  )
}