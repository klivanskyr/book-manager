'use client';

import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import { useState } from "react";

export default function FallBackImage({ className='', src, alt, width, height }: { className?: string, src: string, alt: string, width: number, height: number }) {
    const [curSrc, setCurSrc] = useState(src);

    return (
        <Image
            priority={true}
            className={className}
            as={NextImage}
            src={src}
            alt={alt}
            width={width}
            height={height}
            onError={() => setCurSrc('/assets/cover-placeholder.png')}
        />
    )
}