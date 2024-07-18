'use client';

import { FallBackImage, ModalElement, Stars } from "@/components";
import { Book } from "../types/Book";
import { Shelf } from "../types/Shelf";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Button, Modal, Textarea } from "@nextui-org/react";

export default function BooksList({ isOwner=false, handleRemoveBook=()=>{}, books, shelf, handleUpdateShelf=()=>{} }: { isOwner?: boolean, handleRemoveBook?: Function, shelf: Shelf, books: Book[], handleUpdateShelf?: Function }) {
    const [activeDeleteModal, setActiveDeleteModal] = useState<boolean>(false);
    const [activeReviewModal, setActiveReviewModal] = useState<boolean>(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    const isAllBooks = shelf.shelfId === 'all-books';

    if (books.length === 0) {
        return (
            <div className="flex flex-row justify-center items-center text-center">
                <h1 className="text-3xl font-light pt-[50px]">Looking a little empty here...</h1>
            </div>
        )
    }

    //DELETE MODAL FUNCTIONS
    function handleDeleteOpen(book: Book) {
        setActiveDeleteModal(true);
        setSelectedBook(book);
    }

    function handleDeleteClose() {
        setActiveDeleteModal(false);
        setSelectedBook(null);
    }

    function DeleteHeader() {
        if (!selectedBook) return <></>;
        
        // All books removes all instances of the book
        if (shelf.shelfId === 'all-books') {
            return (
                <div className="m-2 flex flex-col justify-center items-center text-center w-full text-xl font-normal">
                    <p>Are you sure you want to remove</p>
                    <p className="font-semibold">{selectedBook.title}</p>
                    <p>from <span className='font-semibold text-red-500 underline'>ALL</span> shelves?</p>
                </div>
            )
        }

        // Single shelf removes only the book from the shelf
        return (
            <div className="m-2 flex flex-col justify-center items-center text-center w-full text-xl font-normal">
                <p>Are you sure you want to remove</p>
                <p className="font-semibold">{selectedBook.title}</p>
                <p>from the shelf?</p>
            </div>
        )
    }

    function DeleteBody() {
        return (
            <div className="w-full flex flex-row justify-center items-center">
                <Button className="mx-2 text-red-600 bg-white border border-red-600 hover:text-white hover:bg-red-600 " onClick={() => {
                    handleRemoveBook(selectedBook);
                    handleDeleteClose();
                }}>
                    Delete
                </Button>
                <Button className="bg-blue-500 text-white" onClick={handleDeleteClose}>Do Not Delete</Button>
            </div>
        )
    }

    //REVIEW MODAL FUNCTIONS
    function handleReviewOpen(book: Book) {
        setSelectedBook(book);
        setActiveReviewModal(true);
    }

    function handleReviewSubmit() {
        handleUpdateShelf(selectedBook);
        setActiveReviewModal(false);
        setSelectedBook(null);
    }

    function ReviewHeader() {
        if (!selectedBook) return <></>;
        return (
          <div className='w-full flex flex-col justify-center'>
            <h2 className="text-center text-2xl font-semibold mb-1">{`Review of`}</h2>
            <h2 className="text-center text-4xl font-bold mb-5">{selectedBook.title}</h2>
          </div>
        )
    }
    
    function ReviewBody() {
        if (!selectedBook) return <></>;
        return <Textarea disabled={!isOwner} color='primary' size='lg' variant='bordered' placeholder={isOwner ? 'Input review here' : ''} value={selectedBook.review} onChange={(e) => setSelectedBook({ ...selectedBook, review: e.target.value })} />

    }
    
    function ReviewFooter() {
        if (!selectedBook) return <></>;
        const book = shelf.books.find((b) => b.bookId === selectedBook.bookId);
        if (!book) return <></>;
        return (
            <form className='w-full flex flex-col items-center justify-center' onSubmit={(e) => e.preventDefault()}>
                <Stars className='flex flex-row' book={selectedBook} handleUpdate={(newBook: Book) => {
                    setSelectedBook(newBook);
                    handleUpdateShelf(newBook);
                }} size={30} shelfId={shelf.shelfId} userId={shelf.createdById} disabled={!isOwner} />
                {isOwner && <Button className='mt-4 bg-blue-600 text-white font-medium' type='submit' onClick={handleReviewSubmit}>Submit Review</Button>}
            </form>
        )
    }

    return (
        <>
            <ModalElement active={activeDeleteModal} onOpenChange={setActiveDeleteModal} Header={DeleteHeader()} Body={DeleteBody()} />
            <ModalElement active={activeReviewModal} onOpenChange={setActiveReviewModal} Header={ReviewHeader()} Body={ReviewBody()} Footer={ReviewFooter()} />
            <div className="flex flex-col mx-2 lg:mx-0 lg:grid lg:grid-cols-3 max-w-[1500px] pb-8">
                {books.map(book => (
                    <div key={book.bookId} className="shadow-medium flex flex-row items-center p-4 m-2.5 justify-between">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-row items-center justify-end -m-2">
                                {isOwner && <FaTimes className="text-red-500 hover:cursor-pointer" onClick={() => handleDeleteOpen(book)} />}
                            </div>
                            <div className="flex flex-row items-center w-full">
                                <FallBackImage className="max-h-[220px] min-h-[200px] min-w-[140px] rounded-md" alt={`${book.title}`} height={150} width={150} src={book.coverUrl} />
                                <div className="flex flex-col justify-between mx-3 text-center items-center w-full">
                                    <div className="mb-4 w-full">
                                        <h1 className="text-lg font-medium ">{book.title}</h1>
                                        <h2 className="text-[1.1rem]">{book.author}</h2>
                                        <p className="">ISBN: {book.isbn}</p>
                                    </div>
                                    <div>
                                        <Stars className="flex flex-row" book={book} handleUpdate={(newBook: Book) => handleUpdateShelf(newBook)} shelfId={shelf.shelfId} size={25} userId={shelf.createdById} disabled={!isOwner} />
                                        <h3 className='text-blue-500 mt-1.5 hover:cursor-pointer' onClick={() => handleReviewOpen(book)}>{isAllBooks ? 'View Reviews' : 'View Review'}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}