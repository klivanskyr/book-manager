'use client';

import { useState } from 'react';
import { Input, Button } from '@nextui-org/react';

import { passwordEyeFull, passwordEyeSlashed } from '@/assets';
import Image from 'next/image';

export default function PasswordInput({ className='', disabled = false, value, setValue }: { className: string, disabled?: boolean, value: any, setValue: Function }) {
    const [isVisable, setIsVisable] = useState(false);

    return (
        <Input
            label='Password'
            value={value}
            onChange={(e: any) => setValue(e.target.value)}
            className={className}
            size='lg'
            endContent = {
                <Button className='bg-transparent' isIconOnly onClick={() => setIsVisable(!isVisable)}>
                    {isVisable 
                    ? <Image src={passwordEyeSlashed} alt="Hide Password" height={30} width={30} /> 
                    : <Image src={passwordEyeFull} alt="Show Password" height={30} width={30} />}
                </Button>
            }
            type = {isVisable ? "text" : "password" }
            disabled={disabled}
        />
    )
}