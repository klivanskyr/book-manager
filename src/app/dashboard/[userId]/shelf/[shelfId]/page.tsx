'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Image, Spinner } from "@nextui-org/react";

import { Book, Shelf } from "@/types";
import { getAllBooks, getShelf, removeBookFromShelf, updateBookOnUserShelf } from "@/firebase/firestore";
import { BooksList, FilterBar, BookSelect } from "@/components";
import { BookIcon, CopyIcon, ReturnIcon, Settings } from "@/assets";

export default function Page({ params }: { params: { userId: string, shelfId: string }}) {
    const [shelf, setShelf] = useState<Shelf | null>(null);
    const [isBooksLoading, setIsBooksLoading] = useState<boolean>(true);
    const [bookSelectActive, setBookSelectActive] = useState<boolean>(false);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const router = useRouter();

    const isOwner = shelf?.createdById === params.userId;

    const fetchShelf = async () => {
        setIsBooksLoading(true);
        const shelf = params.shelfId === 'all-books' ? await getAllBooks(params.userId) : await getShelf(params.shelfId);
        if (!shelf) {
            console.error('No shelves found', shelf, params);
            return;
        }
        setShelf(shelf);
        setIsBooksLoading(false);
    }

    useEffect(() => {
        fetchShelf();
    }, []);

    const handleRemoveBook = async (book: Book) => {
        if (!shelf) return;
        // Client side update
        const newBooks = shelf.books.filter((b) => b.bookId !== book.bookId);
        const newShelf = { ...shelf, books: newBooks, shownBooks: newBooks };
        setShelf(newShelf);

        // Server side update
        //This might get really slow as the database grows
        const error = await removeBookFromShelf(params.userId, params.shelfId, book.bookId);
        if (error) {
            console.error('Error removing book from shelf', error);
            return;
        }
    }

    const handleUpdateShelf = async (newBook: Book) => {
        if (!shelf) return;
        const oldShelf = shelf;

        // client side update
        const newBooks = shelf.books.map((book) => book.bookId === newBook.bookId ? newBook : book);
        const newShelf = { ...shelf, books: newBooks, shownBooks: newBooks };
        setShelf(newShelf);

        // server side update
        const error = await updateBookOnUserShelf(params.userId, params.shelfId, newBook);
        if (error) {
            console.error('Error updating book', error);
            setShelf(oldShelf); //revert changes
            return;
        }
    }

    type DropDownKeys = "dashboard" | "copy" | "add-book" | "settings";
    function handleDropDown(key: DropDownKeys) {
        switch (key) {
            case "dashboard":
                router.push(`/dashboard/${params.userId}`);
                break;
            case "copy":
                navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_DOMAIN}/explore/${params.shelfId}`);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 5000);
                break;
            case "add-book":
                setBookSelectActive(true);
                break;
            case "settings":
                router.push(`/dashboard/${params.userId}/shelf/${params.shelfId}/settings`);
                break;
            default:
                console.log("Invalid dropdown key");
                break;
        }
    }


    function Header() {
        return (
            <div className="w-full h-auto flex flex-row items-center justify-between p-2 px-4 lg:p-7">
                <div className="flex flex-col h-full w-1/2 lg:w-auto justify-evenly">
                    <h1 className='font-medium text-3xl lg:text-4xl max-w-[500px] truncate'>{shelf?.name || "Title"}</h1>
                    <h2 className="italic font-light max-w-[500px] truncate">{shelf?.description || "Description"}</h2>
                </div>
                <div className="w-1/2 flex flex-col items-end justify-centerm mx-0.5">
                    <div className="flex flex-row mb-4 py-0.5">
                        <Dropdown closeOnSelect={false} >
                            <DropdownTrigger>
                                <Button variant="bordered">Options</Button>
                            </DropdownTrigger>
                            <DropdownMenu variant="faded" aria-label="Drop-down menu" onAction={(key) => handleDropDown(key as DropDownKeys)}>
                                {isOwner ? <DropdownItem
                                    key='add-book'
                                    startContent={<BookIcon className='w-[20px] h-[20px]' />}
                                    textValue="Add Book"
                                    color='primary'
                                >
                                    <div>Add Book</div>
                                </DropdownItem> : <></>}
                                <DropdownItem
                                    key="copy"
                                    startContent={<CopyIcon className='w-[20px] h-[20px]' />}
                                    color={isCopied ? "success" : "default"}
                                    textValue="Copy Link"
                                >
                                    <div>{isCopied ? "Copied!" : "Copy Link"}</div>
                                </DropdownItem>
                                {isOwner ? <DropdownItem
                                    key='settings'
                                    startContent={<Settings className='w-[20px] h-[20px]' />}
                                    textValue="Settings"
                                >
                                    <div>Settings</div>
                                </DropdownItem> : <></>}
                                <DropdownItem
                                    key="dashboard"
                                    startContent={<ReturnIcon className='w-[20px] h-[20px]'/>}
                                    textValue="Go to Dashboard"
                                >
                                    <div>Go to Dashboard</div>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="flex flex-row items-center mt-2">
                        {shelf?.createdByImage
                            ? <p className="text-sm lg:text-xl font-light mr-2">{shelf.createdByName}</p>
                            : <p className="text-sm lg:text-xl font-light mr-2">Created By: {shelf?.createdByName}</p>
                        }
                        {shelf?.createdByImage && <Image className="mr-2" src={shelf.createdByImage} width={30} height={30} alt="User Image" /> }
                    </div>
                </div>
            </div>
        )

    }

    if (shelf === null) {
        return (
            <div className="w-screen h-screen flex flex-row items-center justify-center">
                <Spinner size="lg" label="Loading..."/>
            </div>
        )
    }
    return (
        <div className="w-screen">
            <Header />
            <FilterBar shelf={shelf} setShelf={setShelf} isLoading={isBooksLoading} setIsLoading={setIsBooksLoading}  />
            <BookSelect active={bookSelectActive} setActive={setBookSelectActive} userId={params.userId} fetchShelves={fetchShelf} shelves={[shelf]} />
            {isBooksLoading 
            ? <div className="flex flex-row justify-center items-center w-full h-full"><Spinner size="lg"/></div> 
            : <BooksList handleRemoveBook={handleRemoveBook} handleUpdateShelf={handleUpdateShelf} isOwner={isOwner} shelf={shelf} books={shelf.shownBooks} />}
        </div>
    )
}