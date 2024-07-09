import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";

import { ActionButton, FallBackImage, LoadingButton } from "@/app/components";
import { Book } from "@/app/types/Book";
import { useState } from "react";

export default function BookSelectCard({ book, addBook }: { book: Book, addBook: Function }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        await addBook(book);
        setIsLoading(false);
    }

    function CurrentButton() {
        if (book.selected) {
            return <ActionButton className='bg-red-600' text='Selected' onClick={() => {}} disabled={true} />
        } else if (isLoading) {
            return <LoadingButton className='bg-blue-600' color='primary' isLoading={isLoading} />
        } else {
            return <ActionButton className='bg-blue-600' text='Select' onClick={handleClick} />
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