export type SignLanguageSegment = {
    id: string;
    text: string;
    videoUrl: string;
    fallbackType: 'exact' | 'partial' | 'fingerspell' | 'none';
    startTime?: number; // For synchronization if we merge videos later
    duration?: number;
};

export type SignLanguageProcessResponse = {
    jobId: string;
    status: 'processing' | 'completed' | 'failed';
    segments: SignLanguageSegment[];
    metadata: {
        filename: string;
        totalSegments: number;
        processedAt: string;
    };
};

export type SignLanguageProcessError = {
    error: string;
    code: string;
};
