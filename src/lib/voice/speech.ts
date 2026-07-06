// Minimal interfaces to avoid 'any'
interface SpeechRecognitionEvent {
    resultIndex: number;
    results: {
        [index: number]: {
            [index: number]: {
                transcript: string;
            };
        };
    };
}

interface SpeechRecognitionErrorEvent {
    error: string;
}

interface ISpeechRecognition {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onend: (() => void) | null;
    start: () => void;
    stop: () => void;
}

interface IWindow extends Window {
    webkitSpeechRecognition: new () => ISpeechRecognition;
    SpeechRecognition: new () => ISpeechRecognition;
}

export class SpeechService {
    private recognition: ISpeechRecognition | null = null;
    private isListening: boolean = false;
    private onResultCallback: ((text: string) => void) | null = null;
    private onErrorCallback: ((error: string) => void) | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            const { webkitSpeechRecognition, SpeechRecognition } = window as unknown as IWindow;
            const SpeechAPI = SpeechRecognition || webkitSpeechRecognition;

            if (SpeechAPI) {
                this.recognition = new SpeechAPI();
                this.recognition.continuous = true;
                this.recognition.interimResults = false;
                this.recognition.lang = "en-US";
            }
        }
    }

    public get isSupported(): boolean {
        return !!this.recognition;
    }

    start(onResult: (text: string) => void, onError?: (error: string) => void) {
        if (!this.recognition) return;

        this.onResultCallback = onResult;
        if (onError) this.onErrorCallback = onError;

        this.recognition.onresult = (event: SpeechRecognitionEvent) => {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript;

            // Debounce or valid check could go here
            if (transcript.trim()) {
                this.onResultCallback?.(transcript);
            }
        };

        this.recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            // Unexpected errors
            if (event.error === 'no-speech' || event.error === 'aborted') {
                return;
            }

            if (event.error === 'not-allowed') {
                console.warn("Speech Recognition Permission Denied");
                this.isListening = false;
                this.onErrorCallback?.("Microphone permission denied. Please enable access.");
                return;
            }

            if (event.error === 'network') {
                console.warn("Speech Recognition Network Error");
                // Retry logic could go here, but for now just warn
                return;
            }

            console.error("Speech Recognition Error:", event.error, event);
            this.onErrorCallback?.(event.error);
        };

        this.recognition.onend = () => {
            if (this.isListening && this.recognition) {
                try {
                    this.recognition.start();
                } catch {
                    // Already started or busy
                }
            }
        };

        this.isListening = true;
        try {
            this.recognition.start();
        } catch {
            console.warn("Speech recognition already active");
        }
    }

    stop() {
        this.isListening = false;
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    speak(text: string) {
        if (typeof window === 'undefined') return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.0;
        window.speechSynthesis.speak(utterance);
    }

    silence() {
        if (typeof window !== 'undefined') {
            window.speechSynthesis.cancel();
        }
    }
}

// Export a singleton instance
export const speechService = new SpeechService();
