"use client";

import { useTheme } from "next-themes";
import { useAccessibility } from "@/contexts/accessibility-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Type, Eye, Zap, Mic, Palette, BookOpen, Volume2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function AccessibilitySettings() {
    const {
        fontSize, setFontSize,
        fontStyle, setFontStyle,
        highContrast, setHighContrast,
        reducedMotion, setReducedMotion,
        voiceNavigation, setVoiceNavigation,
        screenNarration, setScreenNarration
    } = useAccessibility();
    const { setTheme, theme } = useTheme();

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Accessibility Settings">
                    <Settings className="h-[1.2rem] w-[1.2rem]" />
                </Button>
            </SheetTrigger>
            <SheetContent className="overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Accessibility & Appearance</SheetTitle>
                </SheetHeader>
                <div className="py-6 space-y-8">

                    {/* Theme Mode */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Palette className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">Theme</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
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
                                Auto
                            </Button>
                        </div>
                    </div>

                    {/* Font Settings Group */}
                    <div className="space-y-6 border-t pt-6">
                        {/* Font Size */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Type className="h-5 w-5 text-primary" />
                                <h3 className="font-medium">Text Size</h3>
                            </div>
                            <RadioGroup
                                value={fontSize}
                                onValueChange={(v) => setFontSize(v as 'normal' | 'large' | 'extra-large')}
                                className="flex gap-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="normal" id="size-normal" />
                                    <Label htmlFor="size-normal">Aa</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="large" id="size-large" />
                                    <Label htmlFor="size-large" className="text-lg">Aa</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="extra-large" id="size-xl" />
                                    <Label htmlFor="size-xl" className="text-xl">Aa</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        {/* Font Style */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5 text-primary" />
                                <h3 className="font-medium">Font Style</h3>
                            </div>
                            <RadioGroup
                                value={fontStyle}
                                onValueChange={(v) => setFontStyle(v as 'system' | 'serif' | 'dyslexic')}
                                className="grid grid-cols-1 gap-3"
                            >
                                <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-accent cursor-pointer">
                                    <RadioGroupItem value="system" id="font-system" />
                                    <Label htmlFor="font-system" className="cursor-pointer font-sans">System Default (Sans)</Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-accent cursor-pointer">
                                    <RadioGroupItem value="serif" id="font-serif" />
                                    <Label htmlFor="font-serif" className="cursor-pointer font-serif">Readability (Serif)</Label>
                                </div>
                                <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-accent cursor-pointer">
                                    <RadioGroupItem value="dyslexic" id="font-dyslexic" />
                                    <Label htmlFor="font-dyslexic" className="cursor-pointer font-style-dyslexic">Dyslexia Friendly</Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </div>

                    {/* Visual Adjustments */}
                    <div className="space-y-6 border-t pt-6">
                        {/* High Contrast */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <Eye className="h-5 w-5 text-primary" />
                                    <Label className="text-base">High Contrast</Label>
                                </div>
                                <p className="text-sm text-muted-foreground">Increase color contrast</p>
                            </div>
                            <Switch
                                checked={highContrast}
                                onCheckedChange={setHighContrast}
                                className="data-[state=checked]:bg-[#EAB0DD]"
                            />
                        </div>

                        {/* Reduced Motion */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <Zap className="h-5 w-5 text-primary" />
                                    <Label className="text-base">Reduced Motion</Label>
                                </div>
                                <p className="text-sm text-muted-foreground">Minimize animations</p>
                            </div>
                            <Switch
                                checked={reducedMotion}
                                onCheckedChange={setReducedMotion}
                                className="data-[state=checked]:bg-[#e09ccf]"
                            />
                        </div>

                        {/* Voice Nav */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <Mic className="h-5 w-5 text-primary" />
                                    <Label className="text-base">Voice Navigation</Label>
                                </div>
                                <p className="text-sm text-muted-foreground">Control UI with voice</p>
                            </div>
                            <Switch
                                checked={voiceNavigation}
                                onCheckedChange={setVoiceNavigation}
                                className="data-[state=checked]:bg-[#d48cc2]"
                            />
                        </div>

                        {/* Screen Narration */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-2">
                                    <Volume2 className="h-5 w-5 text-primary" />
                                    <Label className="text-base">🔊 Screen Narration</Label>
                                </div>
                                <p className="text-sm text-muted-foreground">Read focused items on keypress (Ctrl+Shift+V)</p>
                            </div>
                            <Switch
                                checked={screenNarration}
                                onCheckedChange={setScreenNarration}
                                disabled={!voiceNavigation}
                                className="data-[state=checked]:bg-[#f0c4e5]"
                            />
                        </div>
                    </div>

                </div>
            </SheetContent>
        </Sheet>
    );
}
