'use client';

import React, { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import Modal from 'react-modal'

import Stars from './Stars'
import { Book } from './Book'

const Review = ({ active, book, handleReviewClose, handleRatingUpdate }: { active: boolean, book: Book, handleReviewClose: Function, handleRatingUpdate: Function }) => {

  const [review, setReview] = useState(book.review);
  const [textAreaValue, setTextAreaValue] = useState('auto');

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(e.target.value);
  }

  const onRequestClose = () => {
    handleReviewClose(review);
  }

  return (
    <Modal
      isOpen={active}
      onRequestClose={onRequestClose}
      className="flex items-center justify-center h-auto outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center "
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
        <Stars size={30} book={book} handleRatingUpdate={handleRatingUpdate} />
      </div>
    </Modal>
  )
}

export default Review