'use client';

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation"

export default function Profile({ params }: { params: { userId: string }}) {
    const router = useRouter();

    return (
        <div>
            <h1>Profile</h1>
            <Button onClick={() => router.push('/explore')}>Go to Explore</Button>
        </div>
    )
}