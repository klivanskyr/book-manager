'use client';

import { FallBackImage, ModalElement, Stars } from "@/app/components";
import { Book } from "../types/Book";
import { Shelf } from "../types/Shelf";
import { FaTimes } from "react-icons/fa";
import { useState } from "react";
import { Button, Modal, ModalBody, ModalHeader } from "@nextui-org/react";

export default function BooksList({ ownerPermission, handleRemoveBook, books, shelf }: { ownerPermission: boolean, handleRemoveBook: Function, shelf: Shelf, books: Book[] }) {
    const [activeDeleteModal, setActiveDeleteModal] = useState<boolean>(false);
    const [selectedBook, setSelectedBook] = useState<Book | null>(null);

    if (books.length === 0) {
        return (
            <div className="flex flex-row justify-center items-center text-center">
                <h1 className="text-3xl font-light pt-[50px]">Looking a little empty here...</h1>
            </div>
        )
    }

    function handleOpen(book: Book) {
        setActiveDeleteModal(true);
        setSelectedBook(book);
    }

    function handleClose() {
        setActiveDeleteModal(false);
        setSelectedBook(null);
    }

    function Header() {
        if (!selectedBook) return <></>;
        return (
            <div className="m-2 flex flex-col justify-center items-center text-center w-full text-xl font-normal">
                <p>Are you sure you want to remove</p>
                <p className="font-semibold">{selectedBook.title}</p>
                <p>from the shelf?</p>
            </div>
        )
    }

    function Body() {
        return (
            <div className="w-full flex flex-row justify-center items-center">
                <Button className="mx-2 text-red-600 bg-white border border-red-600 hover:text-white hover:bg-red-600 " onClick={() => {
                    handleRemoveBook(selectedBook);
                    handleClose();
                }}>
                    Delete
                </Button>
                <Button className="bg-blue-500 text-white" onClick={handleClose}>Do Not Delete</Button>
            </div>
        )
    }

    return (
        <>
            <ModalElement active={activeDeleteModal} onOpenChange={setActiveDeleteModal} Header={Header()} Body={Body()} Footer={<></>} />
            <div className="grid grid-cols-3 max-w-[1500px] pb-8">
                {books.map(book => (
                    <div key={book.bookId} className="shadow-medium flex flex-row items-center p-4 m-2.5 justify-between">
                        <div className="flex flex-col w-full">
                            <div className="flex flex-row items-center justify-end -m-2">
                                {ownerPermission && <FaTimes className="text-red-500 hover:cursor-pointer" onClick={() => handleOpen(book)} />}
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
                                        <Stars className='flex flex-row' shelfId={shelf.shelfId} book={book} size={25} />
                                        <p className='text-blue-500' >View Review</p>
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