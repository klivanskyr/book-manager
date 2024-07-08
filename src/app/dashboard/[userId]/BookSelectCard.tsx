import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

import { ActionButton, FallBackImage, LoadingButton } from "@/app/components";
import { Book } from "@/app/types/Book";
import { useState } from "react";
import { fetchDominantColor } from "@/app/utils/color";
import { addBooktoUserShelves, getShelves, } from "@/firebase/firestore";
import { Shelf } from "@/app/types/Shelf";

export default function BookSelectCard({ book, selectedShelves, updateFoundBooks }: { book: Book, selectedShelves: Shelf[], updateFoundBooks: Function }) {
    const [isLoading, setIsLoading] = useState(false);
    
    //handle selecting book from modal
    const handleClickAdd = async (): Promise<void> => {
        setIsLoading(true);
        const [r, g, b] = await fetchDominantColor(book.coverUrl);
        const updatedBook = { ...book, selected: true, bgColor: {r: Math.min(r+50, 255), g: Math.min(g+50, 255), b: Math.min(b+50, 255)}};
        updateFoundBooks(updatedBook);
        await addBooktoUserShelves(updatedBook, user.userId, selectedShelves.map((shelf) => shelf.shelfId));
        await setUser({ ...user, shelves: await getShelves(user.userId) as Shelf[] });
        setIsLoading(false);
    }

    // //handle removing book from modal
    // const handleClickRemove = async (): Promise<void>  => {
    //     setIsLoading(true);
    //     if (user && user.books) {
    //         //Find book in user books where it will have an id.
    //         const usersBooksRef = user.books.find((userBook) => userBook.key === book.key);
    //         if (!usersBooksRef) { return; } //Not possible to remove book that is not in user books
    //         await removeBookFromUser(usersBooksRef, user.user_id)
    //         setUser({ ...user, books: await getBooks(user.user_id) });
    //     };
    //     const updatedBook = { ...book, selected: false };
    //     updateFoundBooks(updatedBook);
    //     setIsLoading(false);
    // }

    function CurrentButton() {
        if (book.selected) {
            return <ActionButton className='bg-red-600' text='Selected' onClick={() => {}} disabled={true} />
        } else if (isLoading) {
            return <LoadingButton className='bg-blue-600' color='primary' isLoading={isLoading} />
        } else {
            return <ActionButton className='bg-blue-600' text='Select' onClick={() => handleClickAdd()} />
        }
    }
    
    return (
        <Card key={book.key} className="m-2">
            <CardHeader className="flex justify-center mt-4">
                <FallBackImage className='h-auto w-[150px]' src={book.coverUrl} alt="Book Cover" height={175} width={150} />
            </CardHeader>
            <CardBody className="text-center flex flex-col justify-center mt-2">
                <h1 className="text-lg font-medium">{book.title}</h1>
                <h2 className="text-lg"> {book.author}</h2>
            </CardBody>
            <CardFooter className="flex justify-center my-4">
                <CurrentButton />
            </CardFooter>
        </Card>
    )
}