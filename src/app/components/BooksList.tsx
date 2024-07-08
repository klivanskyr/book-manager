import { FallBackImage, Stars } from "@/app/components";
import { Book } from "../types/Book";
import { Shelf } from "../types/Shelf";

export default function BooksList({ books, shelf }: { shelf: Shelf, books: Book[] }) {
    if (books.length === 0) {
        return (
            <div className="flex flex-row justify-center items-center text-center">
                <h1 className="text-3xl font-light pt-[50px]">Looking a little empty here...</h1>
            </div>
        )
    }
    return (
        <div className="grid grid-cols-3 max-w-[1500px]">
            {books.map(book => (
                <div key={book.bookId} className="shadow-medium flex flex-row items-center p-4 m-4 justify-between">
                    <div className="flex flex-row items-center">
                        <FallBackImage alt={`${book.title}`} height={150} width={150} src={book.coverUrl} />
                        <div className="flex flex-col justify-between mx-3 text-center items-center">
                            <div className="mb-4">
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
            ))}
        </div>
    )
}