'use client';

import React, { useState, useContext, ReactElement } from 'react'
import ModalElement from '@/app/components/ModalElement'

import Stars from '@/app/components/Stars'
import { Book } from '@/app/types/Book'
import { updateUserBook } from '@/firebase/firestore'
import { UserContext } from '@/app/types/UserContext';
import { Button, Textarea } from '@nextui-org/react';

export default function Review({ active, book, setReviewActive }: { active: boolean, book: Book, setReviewActive: Function }): ReactElement {

  const [review, setReview] = useState({ rating: book.rating, text: book.review });
  const { user, setUser } = useContext(UserContext);

  async function handleSubmit(e: any) {
    if (user) {
      const newBook = { ...book, review: review.text, rating: review.rating };
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
        <Textarea size='lg' variant='bordered' placeholder='Input review here' value={review.text} onChange={(e) => setReview({ ...review, text: e.target.value })} />
      </div>
    )

  }

  function Footer() {
    return (
      <form className='flex flex-col items-center justify-center'>
        <Stars size={30} book={{ ...book, rating: review.rating, review: review.text }} />
        <Button className='mt-4 bg-blue-600 text-white font-medium' type='submit' onPress={handleSubmit}>Submit Review</Button>
      </form>
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