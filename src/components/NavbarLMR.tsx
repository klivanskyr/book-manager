export default function NavbarLMR({ leftElements, middleElements, rightElements, className }: { leftElements: JSX.Element[], middleElements: JSX.Element[], rightElements: JSX.Element[], className?: string }) {
    return (
        <div className={className}>
            <div className='flex items-center'>
                {leftElements.map((element, index) => (
                    <div key={index}>{element}</div>
                ))}
            </div>
            <div className='flex items-center'>
                {middleElements.map((element, index) => (
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