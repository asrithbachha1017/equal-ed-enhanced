"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function DesignSystemPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    return (
        <div className="container max-w-5xl mx-auto py-12 space-y-12">
            <div className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Design System</h1>
                <p className="text-lg text-muted-foreground">
                    Accessible, glassmorphism-inspired UI components for the Multimodal Learning Assistant.
                </p>
            </div>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Typography & Colors</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 rounded-md bg-background border text-foreground">Background</div>
                    <div className="p-4 rounded-md bg-card border text-card-foreground">Card</div>
                    <div className="p-4 rounded-md bg-primary text-primary-foreground">Primary</div>
                    <div className="p-4 rounded-md bg-secondary text-secondary-foreground">Secondary</div>
                    <div className="p-4 rounded-md bg-accent text-accent-foreground">Accent</div>
                    <div className="p-4 rounded-md bg-muted text-muted-foreground">Muted</div>
                    <div className="p-4 rounded-md bg-destructive text-destructive-foreground">Destructive</div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Buttons</h2>
                <div className="flex flex-wrap gap-4">
                    <Button>Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="link">Link</Button>
                    <Button variant="glass">Glass</Button>
                    <Button disabled>Disabled</Button>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Inputs & Forms</h2>
                <div className="max-w-md space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="hello@example.com" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" />
                    </div>
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">Interactive Components</h2>
                <div className="flex gap-4">
                    <Button onClick={() => setIsDialogOpen(true)}>Open Dialog</Button>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogHeader>
                            <DialogTitle>Accessibility Check</DialogTitle>
                            <p className="text-sm text-muted-foreground">
                                This modal handles focus management and screen reader announcements automatically.
                            </p>
                        </DialogHeader>
                        <div className="py-4">
                            <Input placeholder="Focus automatically moves here first" />
                        </div>
                        <div className="flex justify-end">
                            <Button onClick={() => setIsDialogOpen(false)}>Save Changes</Button>
                        </div>
                    </Dialog>
                </div>

                <div className="max-w-md">
                    <Tabs defaultValue="account">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="account">Account</TabsTrigger>
                            <TabsTrigger value="password">Password</TabsTrigger>
                        </TabsList>
                        <TabsContent value="account">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Account</CardTitle>
                                    <CardDescription>Make changes to your account here.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <Label>Name</Label>
                                    <Input defaultValue="Student" />
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="password">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Password</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p>Change your password here.</p>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </section>
        </div>
    )
}
