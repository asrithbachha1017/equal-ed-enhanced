import { useState } from 'react';
import { getApiUrl } from '@/lib/api-config';

export function useTracking() {
    const [isLogging, setIsLogging] = useState(false);

    const logInteraction = async (data: { userId: string; contentId: string; type: string; duration?: number; score?: number }) => {
        // Don't block UI on tracking
        try {
            setIsLogging(true);
            await fetch(getApiUrl('/api/interaction'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
        } catch (e) {
            console.error("Tracking failed", e);
        } finally {
            setIsLogging(false);
        }
    };

    return { logInteraction, isLogging };
}
