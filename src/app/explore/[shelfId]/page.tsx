'use client';

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Popover, PopoverContent, PopoverTrigger, Spinner } from "@nextui-org/react";

import { Shelf } from "@/types";
import { getShelf } from "@/firebase/firestore";
import { BooksList, FilterBar } from "@/components";
import { CopyIcon, ReturnIcon } from "@/assets";

export default function Page({ params }: { params: { shelfId: string }}) {
    const [shelf, setShelf] = useState<Shelf | null>(null);
    const [isBooksLoading, setIsBooksLoading] = useState<boolean>(true);
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const router = useRouter();

    const searchParams = useSearchParams();
    const userId = searchParams.get('userId')

    const fetchShelf = async () => {
        setIsBooksLoading(true);
        const shelf = await getShelf(params.shelfId);
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

    type DropDownKeys = "explore" | "copy";
    async function handleDropDown(key: DropDownKeys) {
        switch (key) {
            case "explore":
                router.push(userId ? `/explore?userId=${userId}` : `/explore`);
                break;
            case "copy":
                await navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_API_DOMAIN}/explore/${params.shelfId}`);
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 5000);
                break;
            default:
                console.log("Invalid dropdown key");
                break;
        }
    }

    function Header() {
        return (
            <div className="w-full h-auto flex flex-row items-center justify-between p-7">
                <div className="flex flex-col h-full w-auto justify-evenly">
                    <h1 className='font-medium text-4xl max-w-[500px] truncate'>{shelf?.name || "Title"}</h1>
                    <h2 className="italic font-light max-w-[500px] truncate">{shelf?.description || "Description"}</h2>
                </div>
                <div className="flex flex-col items-end justify-centerm mx-0.5">
                    <div className="flex flex-row">
                        <Dropdown closeOnSelect={false} >
                            <DropdownTrigger>
                                <Button variant="bordered">Options</Button>
                            </DropdownTrigger>
                            <DropdownMenu variant="faded" aria-label="Drop-down menu" onAction={(key) => handleDropDown(key as DropDownKeys)}>
                                <DropdownItem
                                    key="explore"
                                    startContent={<ReturnIcon className='w-[20px] h-[20px]'/>}
                                    textValue="Go to Explore"
                                >
                                    <div>Go to Explore</div>
                                </DropdownItem>
                                <DropdownItem
                                    key="copy"
                                    startContent={<CopyIcon className='w-[20px] h-[20px]' />}
                                    color={isCopied ? "success" : "default"}
                                    textValue="Copy Link"
                                >
                                    <div>{isCopied ? "Copied!" : "Copy Link"}</div>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                    <div className="flex flex-row mt-2">
                        <p className="mr-8">Created By: {shelf?.createdByName || "Username"}</p>
                        <p className="mr-2">IMAGE</p>
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
        <Suspense>
            <Header />
            <FilterBar shelf={shelf} setShelf={setShelf} isLoading={isBooksLoading} setIsLoading={setIsBooksLoading}  />
            {isBooksLoading 
            ? <div className="flex flex-row justify-center items-center w-full h-full"><Spinner size="lg"/></div> 
            : <BooksList shelf={shelf} books={shelf.shownBooks} />}
        </Suspense>
    )
}