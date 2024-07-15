import { FaStar } from 'react-icons/fa';
import { motion } from 'framer-motion';

import { Book } from '@/types/Book';
import { updateBookOnUserShelf } from '@/firebase/firestore';

export default function Stars({ size, className='', userId, shelfId, book, handleUpdate, disabled=false }: { size: number, className?: string, userId: string, shelfId: string, book: Book, handleUpdate: Function, disabled?: boolean}) {

  // Update star/rating amount
  const handleRatingUpdate = async (book: Book, starIndex: number) => {
    const isResetRating = book.rating === starIndex + 1; // Reset rating if the same star is clicked
    const newRating = isResetRating ? 0 : starIndex + 1;
    const newBook = { ...book, rating: newRating };
    const error = await updateBookOnUserShelf(userId, shelfId, newBook);
    if (error) {
      console.error('Error updating book rating', error);
      return;
    }
    handleUpdate(newBook);
  } 

  return (
    <div className={className} >
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: disabled ? 1 : 1.1 }}
            className='cursor-pointer'
          >
            {disabled 
            ? <FaStar key={i} color={i < book.rating ? '#01af93' : '#bbbbbb'} size={size} /> 
            : <FaStar key={i} color={i < book.rating ? '#01af93' : '#bbbbbb'} onClick={() => handleRatingUpdate(book, i)} size={size} />}
          </motion.div>
        ))}
    </div>
  )
}