import { prisma } from '../../../lib/prisma'

async function getNames(): Promise<string[]> {
  const names = await prisma.user.findMany({
    select: {
      username: true
    }
  })
  return names.map((name) => name.username);
}

export default async function Header() {
  const names = await getNames();

  return (
    <div className="flex flex-row flex-wrap flex-1 justify-center bg-sky-100 shadow-lg shadow-slate-300 p-5 text-2xl font-serif font-">
        <h1 className="font-bold">Book Inventory Manager</h1>
        <h1>{names}</h1>
        {/* <div>{names.map((name, i) => (
          <p key={i}>{name}</p>
        ))}</div> */}
    </div>
  )
}