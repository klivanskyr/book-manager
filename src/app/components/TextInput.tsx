import { Input } from '@nextui-org/react';

type Radius = 'none' | 'sm' | 'md' | 'lg' | 'full' | undefined;

export default function TextInput({ className='', disabled = false, isClearable = false, radius = 'sm', label, value, setValue }:{ className?: string, disabled?: boolean, isClearable?: boolean, radius?: Radius, label: string, value: any, setValue: Function }) {
    return (
        <Input
            isClearable={isClearable}
            type="text"
            label={label}
            size='lg'
            radius={radius}
            className={className}
            value={value}
            onChange={(e: any) => setValue(e.target.value)}
            disabled={disabled}
        />
    )

}