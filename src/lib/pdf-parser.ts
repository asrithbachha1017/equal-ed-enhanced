// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import pdf from 'pdf-parse';

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
    try {
        const data = await pdf(buffer);
        // Basic cleaning
        return data.text.replace(/\n\s*\n/g, '\n').trim();
    } catch (error) {
        console.error("PDF Parse Error:", error);
        throw new Error("Failed to extract text from PDF");
    }
}
