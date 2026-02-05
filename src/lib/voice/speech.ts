interface IWindow extends Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
}

export class SpeechService {
    private recognition: any;
    private isListening: boolean = false;
    private onResultCallback: ((text: string) => void) | null = null;
    private onErrorCallback: ((error: any) => void) | null = null;

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

    start(onResult: (text: string) => void, onError?: (error: any) => void) {
        if (!this.recognition) return;

        this.onResultCallback = onResult;
        if (onError) this.onErrorCallback = onError;

        this.recognition.onresult = (event: any) => {
            const current = event.resultIndex;
            const transcript = event.results[current][0].transcript;

            // Debounce or valid check could go here
            if (transcript.trim()) {
                this.onResultCallback?.(transcript);
            }
        };

        this.recognition.onerror = (event: any) => {
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
            this.onErrorCallback?.(event);
        };

        this.recognition.onend = () => {
            if (this.isListening) {
                try {
                    this.recognition.start();
                } catch (e) {
                    // Already started or busy
                }
            }
        };

        this.isListening = true;
        try {
            this.recognition.start();
        } catch (e) {
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
