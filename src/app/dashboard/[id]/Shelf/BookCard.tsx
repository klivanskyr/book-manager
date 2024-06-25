'use client';

import { FallBackImage, Stars } from "@/app/components";
import { removeBookFromUser } from "@/app/db";
import { Book } from "@/app/types/Book";
import { UserContext } from "@/app/types/UserContext";
import { coverPlaceholder } from "@/assets";
import { Button, Card, CardBody, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { useContext, useState } from "react";
import { FaTimes } from "react-icons/fa";
import Review from "./Review";

export default function BookCard ({ book }: { book: Book }) {
    const { user, setUser } = useContext(UserContext);
    const [reviewActive, setReviewActive] = useState(false);

    function handleRemoveBook() {
        if (user) {
            removeBookFromUser(book.id, user.user_id);
        }
    }

    return (
        <>
            <Review active={reviewActive} book={book} setReviewActive={setReviewActive} />
            <Card className="w-auto h-[440px] m-2 hover:cursor-pointer" key={book.key} style={{ backgroundColor: `rgb(${book.bgColor.r}, ${book.bgColor.g}, ${book.bgColor.b})` }}>
                <CardHeader className="flex flex-col justify-start items-start w-full" onClick={() => setReviewActive(true)}>
                    <Button className='bg-transparent h-6' isIconOnly onClick={handleRemoveBook}><FaTimes /></Button>
                    <div className='w-full flex flex-row justify-center center-items' >
                        <FallBackImage
                            className='w-full flex flex-row justify-center items-center'
                            alt="Book Cover"
                            src={book.coverImage}
                            width={140}
                            height={140}
                        />
                    </div>
                </CardHeader>
                <CardBody className="text-center flex flex-col justify-center mt-2 overflow-hidden" onClick={() => setReviewActive(true)}>
                    <h1 className="text-lg font-medium">{book.title}</h1>
                    <h2 className="text-lg"> {book.author}</h2>
                </CardBody>
                <CardFooter className="flex justify-center my-4">
                    <Stars book={book} size={25} />
                </CardFooter>
            </Card>
        </>
    )
}