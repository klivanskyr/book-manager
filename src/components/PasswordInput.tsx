'use client';

import { useState } from 'react';
import { Input, Button } from '@nextui-org/react';

import { PasswordEyeFull, PasswordEyeSlashed } from '@/assets';
import Image from 'next/image';

export default function PasswordInput({ className='', disabled = false, error, value, setValue }: { className?: string, disabled?: boolean, error?: string, value: any, setValue: Function }) {
    const [isVisable, setIsVisable] = useState(false);

    return (
        <Input
            label='Password'
            autoComplete='password'
            value={value}
            onChange={(e: any) => setValue(e.target.value)}
            className={className}
            size='lg'
            endContent = {
                <Button className='bg-transparent' isIconOnly onClick={() => setIsVisable(!isVisable)}>
                    {/* If password is empty, dont show icon. Then allow switching between text and password */}
                    {!value ? <></> : (isVisable
                    ? <PasswordEyeSlashed className='w-[30px] h-[30px]' /> 
                    : <PasswordEyeFull className='w-[30px] h-[30px]' />)}
                </Button>
            }
            type = {isVisable ? "text" : "password" }
            disabled={disabled}
            isInvalid={Boolean(error)}
            errorMessage={error}
        />
    )
}