import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

import { ActionButton, FallBackImage, LoadingButton } from "@/app/components";
import { Book } from "@/app/types/Book";
import { useContext, useState } from "react";
import { fetchDominantColor } from "@/app/utils/color";
import { UserContext } from "@/app/types/UserContext";
import { addBookToUser, removeBookFromUser } from "@/app/db";

export default function BookSelectCard({ book, updateFoundBooks }: { book: Book, updateFoundBooks: Function }) {
    const { user, setUser } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);
    
    //handle selecting book from modal
    const handleClickAdd = async (): Promise<void> => {
        setIsLoading(true);
        const [r, g, b] = await fetchDominantColor(book.coverImage);
        const updatedBook = { ...book, selected: true, bgColor: {r: Math.min(r+50, 255), g: Math.min(g+50, 255), b: Math.min(b+50, 255)}};
        updateFoundBooks(updatedBook);
        if (user) {
            await addBookToUser(updatedBook, user.user_id);
        } 
        setIsLoading(false);
    }

    //handle removing book from modal
    const handleClickRemove = async (): Promise<void>  => {
        setIsLoading(true);
        if (user && user.books) {
            //Find book in user books where it will have an id.
            const usersBooksRef = user.books.find((userBook) => userBook.key === book.key);
            if (!usersBooksRef) { return; } //Not possible to remove book that is not in user books
            await removeBookFromUser(usersBooksRef.id, user.user_id)
        };
        const updatedBook = { ...book, selected: false };
        updateFoundBooks(updatedBook);
        setIsLoading(false);
    }

    function CurrentButton() {
        if (book.selected && isLoading) {
            return <LoadingButton className='bg-red-600'  color='danger' isLoading={isLoading} />
        } else if (!book.selected && isLoading) {
            return <LoadingButton className='bg-blue-600' color='primary' isLoading={isLoading} />
        } else if (book.selected && !isLoading) {
            return <ActionButton className='bg-red-600' text='Remove' onClick={() => handleClickRemove()} />
        } else {
            return <ActionButton className='bg-blue-600' text='Select' onClick={() => handleClickAdd()} />
        }
    }
    return (
        <Card key={book.key} className="m-2">
            <CardHeader className="flex justify-center mt-4">
                <FallBackImage src={book.coverImage} alt="Book Cover" height={175} width={150} />
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