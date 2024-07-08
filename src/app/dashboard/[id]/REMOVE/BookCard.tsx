'use client';

import { FallBackImage, Stars } from "@/app/components";
import { getBooks, removeBookFromUser } from "@/firebase/firestore";
import { Book } from "@/app/types/Book";
import { UserContext } from "@/app/types/UserContext";
import { Button, Card, CardBody, CardFooter, CardHeader } from "@nextui-org/react";
import { useContext, useState, memo } from "react";
import { FaTimes } from "react-icons/fa";
import Review from "./Review";

function BookCard ({ book }: { book: Book }) {
    const { user, setUser } = useContext(UserContext);
    const [reviewActive, setReviewActive] = useState(false);
    
    const handleRemoveBook = async () => {
        if (user) {
            await removeBookFromUser(book, user.user_id);
            await setUser({ ...user, books: await getBooks(user.user_id) });
        }
    }

    return (
        <>
            <Review active={reviewActive} book={book} setReviewActive={setReviewActive} />
            <Card className="w-auto h-[440px] m-0.5 hover:cursor-pointer" key={book.key} style={{ backgroundColor: `rgb(${book.bgColor.r}, ${book.bgColor.g}, ${book.bgColor.b})` }}>
                <CardHeader className="flex flex-col justify-start items-start w-full" onClick={() => setReviewActive(true)}>
                    <Button className='bg-transparent h-6' isIconOnly onClick={handleRemoveBook}><FaTimes /></Button>
                    <div className='w-full min-h-[200px] flex flex-row justify-center center-items' >
                        <FallBackImage
                            className='w-[130] flex flex-row justify-center items-center'
                            alt="Book Cover"
                            src={book.coverUrl}
                            width={130}
                            height={200}
                        />
                    </div>
                </CardHeader>
                <CardBody className="text-center flex flex-col justify-center mt-2 overflow-hidden" onClick={() => setReviewActive(true)}>
                    <h1 className="text-lg font-medium mx-2">{book.title}</h1>
                    <h2 className="text-lg mx-2"> {book.author}</h2>
                </CardBody>
                <CardFooter className="flex justify-center -mt-4">
                    <Stars book={book} size={25} />
                </CardFooter>
            </Card>
        </>
    )
}

export default memo(BookCard);