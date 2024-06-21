import { Input } from '@nextui-org/react';

export default function TextInput({ className='', disabled = false, isClearable = false, label, value, setValue }:{ className?: string, disabled?: boolean, isClearable?: boolean, label: string, value: any, setValue: Function }) {
    return (
        <Input
            isClearable={isClearable}
            type="text"
            label={label}
            size='lg'
            className={className}
            value={value}
            onChange={(e: any) => setValue(e.target.value)}
            disabled={disabled}
        />
    )

}