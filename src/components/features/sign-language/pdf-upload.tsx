"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { SignLanguageProcessResponse } from "@/lib/sign-language/types";

interface PDFUploadProps {
    onProcessingComplete: (data: SignLanguageProcessResponse) => void;
}

export function PDFUpload({ onProcessingComplete }: PDFUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = async (file: File) => {
        // Validation
        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF document.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            toast.error("File size must be less than 10MB.");
            return;
        }

        setFileName(file.name);
        setIsUploading(true);
        setUploadProgress(10); // Start progress

        try {
            const formData = new FormData();
            formData.append("file", file);

            // Simulated progress for UX
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) return prev;
                    return prev + 10;
                });
            }, 500);

            const response = await fetch("/api/sign-language/process", {
                method: "POST",
                body: formData,
            });

            clearInterval(progressInterval);

            if (!response.ok) {
                throw new Error("Failed to process PDF");
            }

            setUploadProgress(100);
            const data: SignLanguageProcessResponse = await response.json();

            toast.success("PDF processed successfully!");

            // Small delay to show completion state
            setTimeout(() => {
                onProcessingComplete(data);
                setIsUploading(false);
                setUploadProgress(0);
                setFileName(null);
            }, 500);

        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to process document. Please try again.");
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <Card className="w-full max-w-2xl mx-auto border-dashed border-2 bg-card/50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-6 w-6 text-primary" />
                    Upload Document
                </CardTitle>
                <CardDescription>
                    Upload a PDF to generate a sign language interpretation.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {isUploading ? (
                    <div className="space-y-6 py-8">
                        <div className="flex flex-col items-center justify-center space-y-4">
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <div className="text-center space-y-1">
                                <p className="font-medium text-lg">Processing Document</p>
                                <p className="text-muted-foreground text-sm">Extracting text and mapping key signs...</p>
                            </div>
                        </div>
                        <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                            <div
                                className="bg-primary h-full transition-all duration-300 ease-out"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div
                        className={cn(
                            "flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-colors cursor-pointer",
                            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
                        )}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={triggerFileInput}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf"
                            className="hidden"
                            onChange={(e) => e.target.files && e.target.files[0] && handleFile(e.target.files[0])}
                        />
                        <div className="bg-primary/10 p-4 rounded-full mb-4">
                            <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-1">Click to upload or drag and drop</h3>
                        <p className="text-muted-foreground text-sm mb-4">
                            PDF documents up to 10MB
                        </p>
                        <Button variant="outline" className="mt-2 text-primary border-primary">
                            Select File
                        </Button>
                    </div>
                )}

                {/* Accessibility Announcement for Screen Readers */}
                <div className="sr-only" role="status" aria-live="polite">
                    {isUploading ? `Uploading ${fileName}. Progress ${uploadProgress} percent.` : "Upload area ready. Drop a PDF file here."}
                </div>
            </CardContent>
        </Card>
    );
}
