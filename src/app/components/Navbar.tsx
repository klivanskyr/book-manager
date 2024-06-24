export default function Navbar({ leftElements, rightElements, className }: { leftElements: JSX.Element[], rightElements: JSX.Element[], className?: string }) {
    return (
        <div className={className}>
            <div className='flex items-center'>
                {leftElements.map((element, index) => (
                    <div key={index}>{element}</div>
                ))}
            </div>
            <div className='flex items-center'>
                {rightElements.map((element, index) => (
                    <div key={index}>{element}</div>
                ))}
            </div>
        </div>
    )
}