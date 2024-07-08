'use client';

import { useContext, useState } from "react";

import { ModalElement } from "@/app/components";
import { Shelf } from "@/app/types/Shelf";
import { addShelfToUser, getShelves } from "@/firebase/firestore";
import { UserContext } from "@/app/types/UserContext";
import { Button, Checkbox, Input } from "@nextui-org/react";

export default function AddShelfModal({ active, setActive }: { active: boolean, setActive: Function }) {
    const [input, setInput] = useState({ name: '', description: '', isPublic: false });
    const { user, setUser } = useContext(UserContext);

    function Header() {
        return (
            <div className="flex flex-row justify-center items-center w-full p-1">
                <h1 className="text-3xl font-light" >Create A New Shelf</h1>
            </div>
        )
    }

    function Body() {
        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();
            if (!user) return;
            console.log('input', input as Shelf);
            await addShelfToUser(input as Shelf, user.userId);
            setUser({ ...user, shelves: await getShelves(user.userId) as Shelf[]});
            setActive(false);
        }

        return (
            <div className="flex flex-col h-full w-full">
                <form className="p-10 flex flex-col items-center text-center justify-center shadow-medium rounded-md m-2" onSubmit={(e) => handleSubmit(e)}>
                    <Input className='p-1 mt-16 mb-3 w-[700px]' size='lg' label="Name" value={input.name} onChange={(e) => setInput({ ...input, name: e.target.value})}/>
                    <Input className='p-1 mt-2 mb-10 w-[700px]' size='lg' label="Description" value={input.description} onChange={(e) => setInput({ ...input, description: e.target.value})} />
                    <Checkbox className='p-2 m-5' isSelected={input.isPublic} onValueChange={(newValue) => setInput({ ...input, isPublic: newValue })}>Viewable by others?</Checkbox> 
                    <Button className='shadow-md h-[50px] w-[100px] m-5 p-2 bg-blue-600 text-white' type="submit">Submit</Button>
                </form>
            </div>
        )
    }

    return (
        <ModalElement 
            classNames={{ 
                base: "y-10",
                body: "min-h-[500px]",
                header: "shadow-small",
                footer: "shadow-small",
            }}
            onOpenChange={(isOpen: boolean) => setActive(isOpen)}
            size='5xl'
            active={active} 
            Header={Header()} 
            Body={Body()} 
            Footer={<></>} 
        />
    )
}