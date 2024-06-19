import { Button } from 'antd';


export default function SignoutButton({ handleClick }: { handleClick: React.MouseEventHandler<HTMLButtonElement> }) {
    return (
        <Button type="default" danger onClick={handleClick}>Sign Out</Button>
    )
}