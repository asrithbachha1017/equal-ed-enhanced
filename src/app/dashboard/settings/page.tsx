"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAccessibility } from "@/contexts/accessibility-context";
import { Bell, User, Shield, Eye, Type, Zap, Mic, Palette } from "lucide-react";
import { useTheme } from "next-themes";

export default function SettingsPage() {
    const { setTheme, theme } = useTheme();
    const {
        highContrast, setHighContrast,
        reducedMotion, setReducedMotion,
        voiceNavigation, setVoiceNavigation
    } = useAccessibility();

    return (
        <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and application preferences.</p>
                </div>
                <Button>Save Changes</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">

                {/* Account Settings */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" /> Account Information
                            </CardTitle>
                            <CardDescription>Update your personal details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" defaultValue="Jane Doe" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input id="email" defaultValue="jane@example.com" />
                            </div>
                            <Button variant="outline" className="w-full">Change Password</Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Bell className="h-5 w-5" /> Notifications
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="emails">Email Alerts</Label>
                                <Switch id="emails" defaultChecked />
                            </div>
                            <div className="flex items-center justify-between">
                                <Label htmlFor="progress">Weekly Progress</Label>
                                <Switch id="progress" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Accessibility & Preferences */}
                <div className="space-y-6">
                    {/* App Appearance */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Palette className="h-5 w-5" /> App Appearance
                            </CardTitle>
                            <CardDescription>Customize how the application looks.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <Label>Theme Preference</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    <Button
                                        variant={theme === 'light' ? 'default' : 'outline'}
                                        onClick={() => setTheme('light')}
                                        className="w-full"
                                    >
                                        Light
                                    </Button>
                                    <Button
                                        variant={theme === 'dark' ? 'default' : 'outline'}
                                        onClick={() => setTheme('dark')}
                                        className="w-full"
                                    >
                                        Dark
                                    </Button>
                                    <Button
                                        variant={theme === 'system' ? 'default' : 'outline'}
                                        onClick={() => setTheme('system')}
                                        className="w-full"
                                    >
                                        System
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Select &apos;System&apos; to match your device settings.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-primary/20 bg-primary/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <Shield className="h-5 w-5" /> Accessibility Preference
                            </CardTitle>
                            <CardDescription>Customize your learning experience.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4" />
                                        <span className="font-medium">High Contrast</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Increase visibility.</p>
                                </div>
                                <Switch checked={highContrast} onCheckedChange={setHighContrast} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Zap className="h-4 w-4" />
                                        <span className="font-medium">Reduced Motion</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Minimize animations.</p>
                                </div>
                                <Switch checked={reducedMotion} onCheckedChange={setReducedMotion} />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="space-y-0.5">
                                    <div className="flex items-center gap-2">
                                        <Mic className="h-4 w-4" />
                                        <span className="font-medium">Voice Navigation</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">Control via voice commands.</p>
                                </div>
                                <Switch checked={voiceNavigation} onCheckedChange={setVoiceNavigation} />
                            </div>

                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
