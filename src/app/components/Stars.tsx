'use client';

import React, { useContext } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { Book } from '@/app/types/Book';
import { UserContext } from '@/app/types/UserContext';
import { updateUserBook } from '@/app/db/db';

const Stars = ({ size, book }: { size: number, book: Book }) => {
  const { user, setUser } = useContext(UserContext);

   // Update star/rating amount
   async function handleRatingUpdate(book: Book, starIndex: number): Promise<void> {
    if (user && book.rating === starIndex + 1) {
      const newBook = { ...book, rating: 0 };
      await updateUserBook(newBook, user.user_id);
    } else if (user) {
      const newBook = { ...book, rating: starIndex + 1 };
      await updateUserBook(newBook, user.user_id);
    }
};

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

export default Stars