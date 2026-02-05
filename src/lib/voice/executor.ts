import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { VoiceIntent } from "./intents";
import { SpeechService } from "./speech";

export class ActionExecutor {
    private router: AppRouterInstance;
    private speech: SpeechService;

    constructor(router: AppRouterInstance, speech: SpeechService) {
        this.router = router;
        this.speech = speech;
    }

    public async execute(intent: VoiceIntent): Promise<string> {
        switch (intent.type) {
            case 'NAVIGATE':
                return this.handleNavigation(intent.payload);
            case 'INTERACT':
                return this.handleInteraction(intent.payload);
            case 'READ_SCREEN':
                return this.handleReading(intent.payload);
            case 'SYSTEM_CONTROL':
                return this.handleSystem(intent.payload);
            case 'QUERY':
                return this.handleQuery();
            default:
                return "I'm not sure what you want me to do.";
        }
    }

    private handleNavigation(target?: string): string {
        if (!target) return "Where would you like to go?";
        const t = target.toLowerCase();

        if (t.includes("home")) {
            this.router.push("/");
            return "Navigating to Home.";
        }
        if (t.includes("dashboard")) {
            this.router.push("/dashboard");
            return "Opening Dashboard.";
        }
        if (t.includes("settings") || t.includes("preferences")) {
            this.router.push("/dashboard/settings");
            return "Opening Settings.";
        }
        if (t.includes("course") || t.includes("class")) {
            this.router.push("/dashboard/courses");
            return "Opening Courses Catalog.";
        }
        if (t.includes("student") || t.includes("profile")) {
            this.router.push("/dashboard/students");
            return "Opening Student Profile.";
        }
        if (t.includes("practice") || t.includes("monitor") || t.includes("sign")) {
            this.router.push("/monitor?mode=practice");
            return "Starting Sign Language Practice Mode.";
        }
        if (t.includes("lab") || t.includes("math")) {
            // Future route
            return "Math Lab is coming soon.";
        }

        return `I couldn't find a page named ${target}.`;
    }

    private handleInteraction(target?: string): string {
        if (!target) return "What should I click?";
        if (typeof document === 'undefined') return "I can't interact with the screen right now.";

        const text = target.toLowerCase().trim();
        // Selector strategy: Look for buttons, links, inputs
        const elements = Array.from(
            document.querySelectorAll("button, a, input, [role='button'], [tabindex]")
        ) as HTMLElement[];

        // Priority: Exact match -> Contains whole word -> Contains partial
        let match = elements.find(el =>
            (el.innerText?.toLowerCase() === text) ||
            (el.ariaLabel?.toLowerCase() === text)
        );

        if (!match) {
            match = elements.find(el =>
                (el.innerText?.toLowerCase().includes(text)) ||
                (el.ariaLabel?.toLowerCase().includes(text))
            );
        }

        if (match) {
            match.focus();
            match.click();
            return `Clicking ${match.innerText || match.ariaLabel || "item"}.`;
        }

        return `I couldn't find a button or link named ${target}.`;
    }

    private handleReading(target?: string): string {
        if (typeof document === 'undefined') return "";

        let textToRead = "";

        if (!target || target.includes("everything") || target.includes("page") || target.includes("screen")) {
            const main = document.querySelector("main") || document.body;
            textToRead = main.innerText.substring(0, 500); // Limit length
            this.speech.speak(textToRead);
            return "Reading page content.";
        }

        // Try to find a heading or section
        const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, p")) as HTMLElement[];
        const match = headings.find(h => h.innerText.toLowerCase().includes(target.toLowerCase()));

        if (match) {
            textToRead = match.innerText;
            // Read next sibling too if it's a paragraph
            if (match.nextElementSibling && match.nextElementSibling.tagName === 'P') {
                textToRead += ". " + (match.nextElementSibling as HTMLElement).innerText;
            }
            this.speech.speak(textToRead);
            return `Reading section: ${target}.`;
        }

        return `I couldn't find text about ${target}.`;
    }

    private handleSystem(command?: string): string {
        if (command?.includes('stop') || command?.includes('silence')) {
            this.speech.stop(); // Stops listening?? User might mean stop talking
            this.speech.silence(); // Stop speaking
            return "Stopped.";
        }
        return "System command executed.";
    }

    private handleQuery(): string {
        if (typeof document !== 'undefined') {
            return `You are currently on the ${document.title} page.`;
        }
        return "I'm not sure where we are.";
    }
}
