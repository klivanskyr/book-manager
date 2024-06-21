import { Button } from '@nextui-org/react';

export default function ActionButton({ className='', disabled = false, text, onClick }: { className: string, disabled?: boolean, text: string, onClick: Function }) {
    return (
        <Button
            color='primary'
            type='submit'
            className={className}
            size='lg'
            onClick={(e) => onClick()}
            disabled={disabled}
        >
            {text}
        </Button>
    )
}