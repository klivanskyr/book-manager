import { Input } from '@nextui-org/react';

export default function EmailInput({ className='', disabled = false, value, setValue }: { className: string, disabled?: boolean, value: any, setValue: Function }) {
    return (
        <Input
            isClearable
            type="email"
            label="Email"
            size='lg'
            className={className}
            value={value}
            onChange={(e: any) => setValue(e.target.value)}
            disabled={disabled}
        />
    )

}