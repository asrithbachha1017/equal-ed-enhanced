"use client";

import { useState } from 'react';
import { getApiUrl } from '@/lib/api-config';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function UploadPage() {
    const [title, setTitle] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [text, setText] = useState('');
    const [moduleId, setModuleId] = useState('demo-module-1'); // Mock ID
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('moduleId', moduleId);
            formData.append('type', 'TEXT');

            if (file) {
                formData.append('file', file);
            } else if (text) {
                formData.append('text', text);
            } else {
                throw new Error("Please provide a file or text content");
            }

            const res = await fetch(getApiUrl('/api/content'), {
                method: 'POST',
                body: formData, // Auto-sets multipart/form-data
            });

            if (!res.ok) throw new Error('Upload failed');

            setMessage('Content uploaded successfully! AI processing started.');
            setTitle('');
            setFile(null);
            setText('');
        } catch (error) {
            console.error(error);
            setMessage('Error uploading content');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Upload Content</h1>
            <Card className="glass-panel">
                <CardHeader>
                    <CardTitle>Add New Learning Material</CardTitle>
                    <CardDescription>Upload PDF documents or paste text directly. AI will generate audio and simplified versions automatically.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Content Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Introduction to Photosynthesis"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="moduleId">Module ID (Mock)</Label>
                            <Input
                                id="moduleId"
                                value={moduleId}
                                onChange={(e) => setModuleId(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="file">Upload PDF / Text File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    accept=".pdf,.txt"
                                    className="cursor-pointer file:cursor-pointer"
                                    onChange={(e) => {
                                        if (e.target.files) setFile(e.target.files[0]);
                                    }}
                                />
                                <p className="text-xs text-muted-foreground">Prioritized over text input if selected.</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="text">Or Paste Text Content</Label>
                                <textarea
                                    id="text"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Paste raw text here..."
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                                {loading ? 'Uploading & Processing...' : 'Upload Content'}
                            </Button>
                        </div>

                        {message && (
                            <p className={`text-sm ${message.includes('Error') ? 'text-destructive' : 'text-green-400'}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
