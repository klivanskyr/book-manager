export default function Form({ elements }: { elements: JSX.Element[] }) {
    return (
        <div className='flex flex-col justify-center items-center w-screen h-screen'>
            <div className='flex flex-col justify-center items-center w-1/2 h-auto rounded shadow-large'>
                <form className='p-16 w-full h-full flex flex-col items-center'>
                    {elements.map((element, index) => (
                        <div key={index} className='w-full flex items-center justify-center'>{element}</div>
                    ))}
                </form>
            </div>
        </div>  
    )
}