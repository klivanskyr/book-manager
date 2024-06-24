'use client';

import { Image } from "@nextui-org/react";
import NextImage from "next/image";
import React, { useState } from "react";

export default function FallBackImage({ src, alt, width, height }: { src: string, alt: string, width: number, height: number }) {
    const [curSrc, setCurSrc] = useState(src);

    return (
        <Image
            className="h-auto"
            as={NextImage}
            src={src}
            alt={alt}
            width={width}
            height={height}
            onError={() => setCurSrc('/assets/cover-placeholder.png')}
        />
    )
}