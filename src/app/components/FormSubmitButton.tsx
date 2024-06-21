'use client';

import { Button } from '@nextui-org/react';

export default function FormSubmitButton({ className='', disabled = false, text, onSubmit }: { className: string, disabled?: boolean, text: string, onSubmit: Function }) {
    return (
        <Button
            color='primary'
            type='submit'
            className={className}
            size='lg'
            onClick={(e) => onSubmit()}
            disabled={disabled}
        >
            {text}
        </Button>
    )
}