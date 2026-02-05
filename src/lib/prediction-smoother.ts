/**
 * Prediction Smoother for Sign Language Recognition
 * 
 * Implements temporal smoothing to reduce flickering predictions:
 * - Maintains a sliding window of recent predictions
 * - Requires majority agreement for stable output
 * - Filters low-confidence predictions
 * - Provides stability feedback for UI
 */

export interface Prediction {
    letter: string;
    confidence: number;
    timestamp: number;
}

export interface StableResult {
    letter: string;
    confidence: number;
    isStable: boolean;
    agreementRatio: number;
    feedbackMessage: string;
}

export class PredictionSmoother {
    private buffer: Prediction[] = [];
    private readonly windowSize: number;
    private readonly minConfidence: number;
    private readonly minAgreementRatio: number;
    private readonly stabilityDurationMs: number;

    private lastStableLetter: string = "";
    private lastStableTime: number = 0;

    constructor(options?: {
        windowSize?: number;
        minConfidence?: number;
        minAgreementRatio?: number;
        stabilityDurationMs?: number;
    }) {
        this.windowSize = options?.windowSize ?? 5;
        this.minConfidence = options?.minConfidence ?? 0.75;
        this.minAgreementRatio = options?.minAgreementRatio ?? 0.6; // 3/5 = 0.6
        this.stabilityDurationMs = options?.stabilityDurationMs ?? 400;
    }

    /**
     * Add a new prediction to the buffer and get stable result
     */
    addPrediction(letter: string, confidence: number): StableResult {
        const now = Date.now();

        // Add to buffer
        this.buffer.push({ letter, confidence, timestamp: now });

        // Remove old predictions outside window
        while (this.buffer.length > this.windowSize) {
            this.buffer.shift();
        }

        return this.getStableResult();
    }

    /**
     * Analyze buffer and return stable prediction
     */
    private getStableResult(): StableResult {
        const now = Date.now();

        // Filter predictions by confidence threshold
        const validPredictions = this.buffer.filter(p =>
            p.confidence >= this.minConfidence &&
            p.letter !== "None" &&
            p.letter !== "?" &&
            p.letter !== "Error"
        );

        // If no valid predictions, return uncertain state
        if (validPredictions.length === 0) {
            return {
                letter: "?",
                confidence: 0,
                isStable: false,
                agreementRatio: 0,
                feedbackMessage: this.buffer.some(p => p.letter !== "None")
                    ? "Hold the sign steady..."
                    : "Show your hand to the camera"
            };
        }

        // Count occurrences of each letter
        const letterCounts = new Map<string, { count: number; totalConfidence: number }>();
        for (const pred of validPredictions) {
            const existing = letterCounts.get(pred.letter) || { count: 0, totalConfidence: 0 };
            letterCounts.set(pred.letter, {
                count: existing.count + 1,
                totalConfidence: existing.totalConfidence + pred.confidence
            });
        }

        // Find letter with highest count (majority vote)
        let topLetter = "";
        let topCount = 0;
        let topAvgConfidence = 0;

        letterCounts.forEach((stats, letter) => {
            if (stats.count > topCount ||
                (stats.count === topCount && stats.totalConfidence > topAvgConfidence * topCount)) {
                topLetter = letter;
                topCount = stats.count;
                topAvgConfidence = stats.totalConfidence / stats.count;
            }
        });

        // Calculate agreement ratio
        const agreementRatio = topCount / this.windowSize;

        // Check if we have sufficient agreement
        if (agreementRatio < this.minAgreementRatio) {
            return {
                letter: topLetter,
                confidence: topAvgConfidence,
                isStable: false,
                agreementRatio,
                feedbackMessage: "Hold steady... detecting sign"
            };
        }

        // Check temporal stability (same letter for stabilityDurationMs)
        if (topLetter !== this.lastStableLetter) {
            this.lastStableLetter = topLetter;
            this.lastStableTime = now;
        }

        const stableDuration = now - this.lastStableTime;
        const isTemporallyStable = stableDuration >= this.stabilityDurationMs;

        if (!isTemporallyStable) {
            return {
                letter: topLetter,
                confidence: topAvgConfidence,
                isStable: false,
                agreementRatio,
                feedbackMessage: `Detecting: ${topLetter}...`
            };
        }

        // Stable prediction!
        return {
            letter: topLetter,
            confidence: topAvgConfidence,
            isStable: true,
            agreementRatio,
            feedbackMessage: `✓ ${topLetter} (${Math.round(topAvgConfidence * 100)}%)`
        };
    }

    /**
     * Clear the prediction buffer
     */
    reset(): void {
        this.buffer = [];
        this.lastStableLetter = "";
        this.lastStableTime = 0;
    }

    /**
     * Get current buffer state for debugging
     */
    getBufferState(): { letters: string[]; confidences: number[] } {
        return {
            letters: this.buffer.map(p => p.letter),
            confidences: this.buffer.map(p => p.confidence)
        };
    }
}

// Singleton instance for app-wide use
let smootherInstance: PredictionSmoother | null = null;

export function getPredictionSmoother(): PredictionSmoother {
    if (!smootherInstance) {
        smootherInstance = new PredictionSmoother({
            windowSize: 5,
            minConfidence: 0.70,
            minAgreementRatio: 0.6,
            stabilityDurationMs: 400
        });
    }
    return smootherInstance;
}
