'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Quote } from 'lucide-react';

export function QuoteSection() {
    return (
        <div className="max-w-2xl">
            <Link href="/" className="absolute top-0 right-0 rounded-bl-xl p-5">
                <Image
                    src="/logo.png"
                    className="w-16 rotate-y-180 drop-shadow-[0px_1px_3px_rgba(0,0,25,0.9)] transition-all duration-300 hover:cursor-pointer"
                    alt="Logo"
                    width={62}
                    height={62}
                />
            </Link>
            <div className="bg-secondary mb-12 w-fit rounded-xl p-6 drop-shadow-[-15px_15px_0px_rgba(179,178,178,0.9)]">
                <Quote strokeWidth="3" size="34" className="rotate-z-180" />
            </div>
            <p className="mt-4 text-2xl leading-tight font-medium text-white md:text-4xl lg:text-6xl">
                “La música construye un puente entre el mundo de los sentidos y
                el mundo de las ideas.”
            </p>
        </div>
    );
}
