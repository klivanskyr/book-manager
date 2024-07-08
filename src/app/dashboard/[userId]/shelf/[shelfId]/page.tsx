'use client';

import { useContext, useEffect, useState } from "react";

import { UserContext } from "@/app/types/UserContext";
import { Shelf } from "@/app/types/Shelf";

export default function Page({ params }: { params: { userId: string, shelfId: string }}) {
    const { user, setUser } = useContext(UserContext);
    const [shelf, setShelf] = useState<Shelf | null>(null);

    useEffect(() => {
      
    }, [])
    

    return (
        <div>
            <h1>{params.userId}</h1>
            <h2>{params.shelfId}</h2>
        </div>
    )
}