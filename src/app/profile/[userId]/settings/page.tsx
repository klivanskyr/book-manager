'use client';

import { useEffect, useState } from "react";

import { Button, Image, Input, Skeleton } from "@nextui-org/react";
import { getUser } from "@/firebase/firestore";
import { useRouter } from "next/navigation";

type UserData = {
    image: string,
    username: string,
    email: string,
    password?: string
}
export default function ProfileSettings({ params }: { params: { userId: string }}) {
    const [input, setInput] = useState<UserData>({ image: '', username: '', email: '', password: '' })
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    const fetchUserData = async () => {
        const userData = await getUser(params.userId);
        if (!userData) {
            console.error('No user data found');
            return;
        }
        setUserData({
            image: userData.profileImage,
            username: userData.username,
            email: userData.email,
        });

        setInput({
            image: '',
            username: userData.username,
            email: userData.email,
            password: '',
        });
    }

    useEffect(() => {
        setIsLoaded(false);
        fetchUserData().then(() => setIsLoaded(true));
    }, []);

    const handleUpdate = async (data: { newUsername?: string, newEmail?: string, newImage?: string}) => {
        // client side update
        if (!userData) return;
        setUserData({ ...userData, ...data });
        setInput({ ...input, ...data });

        // server side update
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/api/auth/updateUser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: params.userId, ...data })
        });
        const responseData = await response.json();
        if (responseData.status !== 200) {
            setMessage(responseData.message);
            return;
        }
        setMessage('Updated successfully');
        setTimeout(() => setMessage(''), 3000);
    }

    return (
        <div className='w-auto h-full p-6 lg:p-16 lg:m-8 lg:shadow-large flex flex-col'>
            <h1 className="font-light text-4xl mb-8" >Account Settings</h1>

            {/* Questions */}
            <div className='flex flex-col lg:flex-row'>
                <div className='lg:py-2 lg:pr-4 lg:pl-1'>
                    <div className="flex flex-row items-center">
                        <h2 className="lg:mr-4 w-[100px]">Profile Image</h2>
                        <Skeleton className={`w-[200px] lg:w-[500px] my-2 rounded-2xl ${isLoaded ? 'opacity-100' : 'opacity-40'}`} isLoaded={isLoaded}>
                            <Input classNames={{ "mainWrapper": "w-[200px] lg:w-[500px] my-2 font-semibold" }} placeholder='Image url' size='lg' variant='bordered' value={input.image} onChange={(e) => setInput({ ...input, image: e.target.value })}/>
                        </Skeleton>
                        <Button className='mx-1 h-[45px]' color='primary' onClick={() => handleUpdate({ newImage: input.image})}>Upload</Button>
                    </div>
                    <div className="flex flex-row items-center">
                        <h2 className="lg:mr-4 w-[100px]">Username</h2>
                        <Skeleton className={`w-[200px] lg:w-[500px] my-2 rounded-2xl ${isLoaded ? 'opacity-100' : 'opacity-40'}`} isLoaded={isLoaded}>
                            <Input classNames={{ "mainWrapper": "w-[200px] lg:w-[500px] my-2 font-semibold" }} size='lg' variant='bordered' value={input.username} onChange={(e) => setInput({ ...input, username: e.target.value })}/>
                        </Skeleton>
                        <Button className='mx-1 h-[45px] text-base font-medium border-1 border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white' onClick={() => handleUpdate({ newUsername: input.username })}>Reset</Button>
                    </div>
                    <div className="flex flex-row items-center">
                        <h2 className="lg:mr-4 w-[100px]">Email</h2>
                        <Skeleton className={`w-[200px] lg:w-[500px] my-2 rounded-2xl ${isLoaded ? 'opacity-100' : 'opacity-40'}`} isLoaded={isLoaded}>
                            <Input classNames={{ "mainWrapper": "w-[200px] lg:w-[500px] my-2 font-semibold" }} size='lg' variant='bordered' value={input.email} onChange={(e) => setInput({ ...input, email: e.target.value })}/>
                        </Skeleton>
                        <Button className='mx-1 h-[45px] text-base font-medium border-1 border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white' onClick={() => handleUpdate({ newEmail: input.email })}>Reset</Button>
                    </div>
                    <div>
                        <p className={`text-center h-[100px] ${message.includes('Error') || message.includes('error') ? 'text-red-600' : 'text-blue-600'}`}>
                            {message}
                        </p>
                    </div>
                    <div className='flex flex-col justify-between h-[100px] mt-2'>
                        <Button className='border-1 border-red-600 bg-white text-red-600 hover:bg-red-600 hover:text-white' onClick={() => router.push('/reset')}>Reset Password</Button>
                        <Button variant="bordered" onClick={() => router.push(`/profile/${params.userId}`)}>Return to Profile</Button>
                    </div>
                </div>

                {/* Photos */}
                <div className='flex flex-row justify-center items-center w-full lg:w-[600px] h-full lg:h-[350px] my-16 lg:my-0 lg:mx-16 text-center'>
                    <div className='shadow-medium p-2 m-2 rounded-lg flex flex-col items-center justify-center'>
                        <h3 className='font-light mb-2'>Current Profile Image</h3>
                        <Image src={userData?.image} alt="Current Profile Image" height={130} width={130} />
                    </div>
                    <div className='shadow-medium p-2 m-2 rounded-lg flex flex-col items-center justify-center'>
                        <h3 className="font-light mb-2">New Profile Image</h3>
                        <Image src={input.image} alt="New Profile Image" height={130} width={130} />
                    </div>
                </div>
            </div>
        </div>
    )
}