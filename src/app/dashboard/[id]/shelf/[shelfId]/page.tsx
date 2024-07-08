export default function Page({ params }: { params: { id: string, shelfId: string }}) {
    return (
        <div>
            <h1>{params.id}</h1>
            <h2>{params.shelfId}</h2>
        </div>
    )
}