'use client';

import React, { useState, useContext, ReactElement} from 'react'
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'

import Stars from '../Shelf/Stars'
import { Book } from '@/app/types/Book'
import { updateUserBook } from '@/app/db/db';
import { User, UserContext } from '@/app/types/UserContext';

export default function Review({ active, book, handleReviewClose }: { active: boolean, book: Book, handleReviewClose: Function }): ReactElement {

  const [review, setReview] = useState(book.review);
  const { user, setUser } = useContext(UserContext);

  async function handleInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    if (user) {
      setReview(e.target.value);
      const newBook = { ...book, review: review };
      await updateUserBook(newBook, user.user_id);
    }
  }

  function onRequestClose() {
    handleReviewClose(review);
  }

  return (
    <Modal
      isOpen={active}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center h-auto outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center "
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-full h-auto">
        <FaTimes onClick={onRequestClose} />
        <h2 className="text-center text-2xl font-semibold mb-1">{`Review of`}</h2>
        <h2 className="text-center text-4xl font-bold mb-5">{book.title}</h2>
        <textarea 
          className='w-full h-40 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-auto' 
          value={review} 
          onChange={handleInputChange} 
        />
        <Stars size={30} book={book} />
      </div>
    </Modal>
  )
}