import { Input } from '@nextui-org/react';

export default function EmailInput({ className='', disabled = false, error, value, setValue }: { className?: string, disabled?: boolean, error?: string, value: any, setValue: Function }) {
    return (
        <Input
            isClearable
            autoComplete='email'
            type="email"
            label="Email"
            size='lg'
            className={className}
            value={value}
            onChange={(e: any) => setValue(e.target.value)}
            isInvalid={Boolean(error)}
            errorMessage={error}
            disabled={disabled}
        />
    )

}