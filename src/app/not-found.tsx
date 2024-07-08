import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className='w-screen h-screen flex flex-row justify-center items-center'>
      <div className='shadow-medium rounded-medium p-20 text-center'>
        <h2 className='font-semibold text-4xl mb-6'>Not Found</h2>
        <p className='text-xl mb-1'>Could not find requested resource</p>
        <Link className='text-blue-600 text-lg' href="/">Return Home</Link>
      </div>
    </div>
  )
}