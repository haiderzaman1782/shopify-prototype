'use client';

import { useParams } from 'next/navigation';
import { ThemeProvider } from '@/src/components/ThemeProvider';
import Storefront from '@/src/components/Storefront';

export default function PublicStorePage() {
    const params = useParams();
    const storeId = params.storeId as string;

    return (
        <ThemeProvider>
            <Storefront storeId={storeId} />
        </ThemeProvider>
    );
}
