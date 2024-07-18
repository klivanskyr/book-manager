'use client';

import { useEffect, useState } from "react";

import { Shelf } from "@/types";
import { getShelf, updateShelf } from "@/firebase/firestore";
import { Button, Checkbox, Input, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { ModalElement } from "@/components";

export default function Page({ params }: { params: { userId: string, shelfId: string }}) {
    const [shelf, setShelf] = useState<Shelf | null>(null);
    const [input, setInput] = useState({ name: '', description: '', image: '', isPublic: false })
    const [activeRevertModal, setActiveRevertModal] = useState<boolean>(false);
    const [activeReturnModal, setActiveReturnModal] = useState<boolean>(false);
    const [activeSubmitModal, setActiveSubmitModal] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const router = useRouter();

    const fetchShelf = async () => {
        setIsLoaded(false);
        const shelf = await getShelf(params.shelfId);
        if (!shelf) {
            console.error('No shelves found', shelf, params);
            return;
        }
        setShelf(shelf);
        setInput({ name: shelf.name, description: shelf.description, image: shelf.image, isPublic: shelf.isPublic });
        setIsLoaded(true);
    }

    useEffect(() => {
        fetchShelf();
    }, []);

    useEffect(() => {
        if (message) {
            setMessage('');
        }
    }, [input])

    const handleSubmit = async () => {
        if (!shelf) return;
        const newShelf: Shelf = { ...shelf, name: input.name, description: input.description, image: input.image, isPublic: input.isPublic };
        const error = await updateShelf(newShelf);
        if (error) {
            console.error('Error updating shelf', error);
            return;
        }
        setShelf(newShelf);
        setActiveSubmitModal(false);
        setMessage('Shelf updated successfully');
    }

    const inputChanged = shelf && (input.name !== shelf.name || input.description !== shelf.description || input.image !== shelf.image || input.isPublic !== shelf.isPublic);
    const buttonClassName = 'w-[200px] ' + (inputChanged ? 'bg-red-600 hover:bg-red-500 text-white' : '');

    function Header(message: string) {
        return (
            <div className="m-2 flex flex-col justify-center items-center text-center w-full text-xl font-normal">
                <h1>Are you sure you want to</h1> 
                <h1>{`${message} ?`}</h1>
            </div>
        )
    }

    function Body(callback: Function, setModalActive: Function) {
        return (
            <div className="w-full flex flex-row justify-center items-center">
                <Button className="mx-2 mb-4 text-red-600 bg-white border border-red-600 hover:text-white hover:bg-red-600 " onClick={() => {
                    setModalActive(false);
                    callback();
                }}>
                    Yes
                </Button>
                <Button className="bg-blue-500 text-white mb-4" onClick={() => setModalActive(false)}>No</Button>
            </div>
        )
    }

    return (
        <>
            <ModalElement size='xl' active={activeSubmitModal} onOpenChange={(isOpen: boolean) => setActiveSubmitModal(isOpen)} Header={Header('Submit Changes')} Body={Body(handleSubmit, setActiveSubmitModal)} />
            <ModalElement size='xl' active={activeRevertModal} onOpenChange={(isOpen: boolean) => setActiveRevertModal(isOpen)} Header={Header('Revert All Changes')} Body={Body(() => fetchShelf(), setActiveRevertModal)} />
            <ModalElement size='xl' active={activeReturnModal} onOpenChange={(isOpen: boolean) => setActiveReturnModal(isOpen)} Header={Header('Revert All Changes')} Body={Body(() => router.push(`/dashboard/${params.userId}/shelf/${params.shelfId}`), setActiveReturnModal)} />
            <form  className='w-auto h-screen lg:h-full p-8 lg:p-16 lg:m-8 lg:shadow-large flex flex-col justify-between lg:justify-start' onSubmit={(e) => e.preventDefault()}>
                <h1 className="font-light text-4xl mb-8">Shelf Settings</h1>
                <Skeleton isLoaded={isLoaded} className={`w-[300px] lg:w-[500px] my-2 rounded-md ${isLoaded ? 'opacity-100' : 'opacity-40'}`}>
                    <Input classNames={{ "mainWrapper": "w-[300px] lg:w-[500px] my-2 font-semibold" }} type="text" label="Name" labelPlacement="outside-left" size='lg' value={input.name} onChange={(e) => setInput({ ...input, name: e.target.value })}/>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className={`w-[300px] lg:w-[800px] my-2 rounded-md ${isLoaded ? 'opacity-100' : 'opacity-40'}`}>
                    <Input classNames={{ "mainWrapper": "w-[300px] lg:w-[800px] my-2 font-semibold" }} type="text" label="Description" labelPlacement="outside-left" size='lg' value={input.description} onChange={(e) => setInput({ ...input, description: e.target.value })}/>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className={`w-[300px] lg:w-[500px] my-2 rounded-md ${isLoaded ? 'opacity-100' : 'opacity-40'}`}>
                    <Input classNames={{ "mainWrapper": "w-[300px] w-[500px] my-2 font-semibold" }} type="text" label="Image URL" labelPlacement="outside-left" size='lg' value={input.image} onChange={(e) => setInput({ ...input, image: e.target.value })}/>
                </Skeleton>
                <Skeleton isLoaded={isLoaded} className={`w-[200px] rounded-md ${isLoaded ? 'opacity-100' : 'opacity-40'} mb-4 mt-1`}>
                    <div className='flex flex-row items-center'>
                        <h1 className='mr-2'>Shelf is Public:</h1>
                        <Checkbox className='w-[20px] h-[20px]' color='primary' isSelected={input.isPublic} onValueChange={(value) => setInput({ ...input, isPublic: value })} />
                    </div>
                </Skeleton>
                <div className='flex flex-row items-center w-full'>
                    <div className="flex flex-col h-full">
                        <Button className='w-[200px] mb-1 mt-6' disabled={!inputChanged} color='primary' type='submit' onClick={() => setActiveSubmitModal(true)}>Submit Changes</Button>
                        <Button disabled={!inputChanged} color='default' onClick={() => setActiveRevertModal(true)} className={`${buttonClassName} my-1`}>Revert Changes</Button>
                        {inputChanged 
                            ? <Button color='default' onClick={() => setActiveReturnModal(true)} className={`${buttonClassName} my-1`}>Return to Dashboard</Button>
                            : <Button color='default' onClick={() => router.push(`/dashboard/${params.userId}/shelf/${params.shelfId}`)} className={`${buttonClassName} my-1`}>Return to Dashboard</Button>
                        }
                    </div>
                    <div className='flex flex-row justify-center items-center w-full'>
                        <h1 className={`text-2xl font-light text-blue-600 ${message ? 'opacity-100' : 'opacity-0'}`}>{message}</h1>
                    </div>
                </div>
            </form>
        </>  
    )
}