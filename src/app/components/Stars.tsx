import React, { useContext } from 'react';
import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { Book } from '@/app/types/Book';
import { UserContext } from '@/app/types/UserContext';
import { updateBookOnUserShelf } from '@/firebase/firestore';

export default function Stars({ size, className='', shelfId, book}: { size: number, className?: string, shelfId: string, book: Book}) {
  const { user, setUser } = useContext(UserContext);

  // Update star/rating amount
  const handleRatingUpdate = async (book: Book, starIndex: number) => {
      if (!user || !user.userId || !shelfId) {
        console.log('User or shelfId not found');
        return;
      }
      const isResetRating = book.rating === starIndex + 1; // Reset rating if the same star is clicked
      const newBook = { ...book, rating: isResetRating ? 0 : starIndex + 1 };
      await updateBookOnUserShelf(newBook, user.userId, shelfId);
      const oldShelf = user.shelves.find(s => s.shelfId === shelfId);
      if (!oldShelf) return;
      const newShelf = { ...oldShelf, books: oldShelf.books.map(b => b.bookId === book.bookId ? newBook : b)}
      if (!newShelf) return;
      setUser({
        ...user,
        shelves: user.shelves.map(s => s.shelfId === shelfId ? newShelf : s)
      });
    }

  return (
    <div className={className} >
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
            />
          </motion.div>
        ))}
    </div>
  )
}