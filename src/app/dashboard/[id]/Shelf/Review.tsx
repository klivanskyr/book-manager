'use client';

import React, { useState, useContext, ReactElement } from 'react'
import { FaTimes } from 'react-icons/fa'
import ModalElement from '@/app/components/ModalElement'

import Stars from '@/app/components/Stars'
import { Book } from '@/app/types/Book'
import { updateUserBook } from '@/app/db/db';
import { UserContext } from '@/app/types/UserContext';
import { Textarea } from '@nextui-org/react';

export default function Review({ active, book, setReviewActive }: { active: boolean, book: Book, setReviewActive: Function }): ReactElement {

  const [review, setReview] = useState(book.review);
  const { user, setUser } = useContext(UserContext);

  async function handleInputChange(e: any) {
    if (user) {
      const updatedReview = e.target.value;
      setReview(updatedReview);
      const newBook = { ...book, review: updatedReview };
      await updateUserBook(newBook, user.user_id);
    }
  }

  function Header() {
    return (
      <div className='w-full flex flex-col justify-center'>
        <h2 className="text-center text-2xl font-semibold mb-1">{`Review of`}</h2>
        <h2 className="text-center text-4xl font-bold mb-5">{book.title}</h2>
      </div>
    )
  }

  function Body() {
    return (
      <div>
        <Textarea size='lg' variant='bordered' placeholder='Input review here' value={review} onChange={(e) => handleInputChange(e)} />
      </div>
    )

  }

  function Footer() {
    return (
      <div>
        <Stars size={30} book={book} />
      </div>
    )
  }

  return (
    <ModalElement 
      classNames={{ footer: 'flex flex-row justify-center' }}
      onOpenChange={(isOpen: boolean) => setReviewActive(isOpen)}
      active={active} Header={Header()} Body={Body()} Footer={Footer()}
    />
  )
}