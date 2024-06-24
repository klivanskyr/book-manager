'use client';

import { useContext, useState } from "react";
import { Pagination } from "@nextui-org/react";

import { UserContext } from "@/app/types/UserContext";

export default function Shelf() {
    const { user, setUser } = useContext(UserContext);
    const [currentPage, setCurrentPage] = useState(1);

    if (!user || user?.books.length === 0) return <></>;
    return (
        <div>
            <Pagination size='lg' loop isCompact showControls total={user.books.length} page={currentPage} onChange={setCurrentPage} />
        </div>
    )
}