"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { SignLanguageAvatar } from "@/components/3d/sign-language-avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CameraOff, Play, Pause, AlertCircle, Hand, Loader2 } from "lucide-react";
import NextImage from "next/image";
import * as tf from "@tensorflow/tfjs";
import * as handpose from "@tensorflow-models/handpose";
import * as fp from "fingerpose";
import { ASL_GESTURES } from "@/lib/asl-gestures";
import { PredictionSmoother, StableResult } from "@/lib/prediction-smoother";

import { useSearchParams } from "next/navigation";

// ASL Letters that can be detected (static poses only)
const DETECTABLE_LETTERS = "ABCDEFGHIKLMNOPQRSTUVWXY".split(""); // J and Z require motion

export default function SignLanguageView() {
    const searchParams = useSearchParams();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [isSigning, setIsSigning] = useState(false);
    const [inputText, setInputText] = useState("");

    // AI State
    const [handposeModel, setHandposeModel] = useState<handpose.HandPose | null>(null);
    const [isModelLoading, setIsModelLoading] = useState(true);
    const [modelError, setModelError] = useState<string | null>(null);
    const [handDetected, setHandDetected] = useState(false);

    // Prediction State (with smoothing)
    const [stableResult, setStableResult] = useState<StableResult>({
        letter: "?",
        confidence: 0,
        isStable: false,
        agreementRatio: 0,
        feedbackMessage: "Show your hand to the camera"
    });
    const predictionSmoother = useRef<PredictionSmoother | null>(null);

    // Practice Mode State
    const [practiceMode, setPracticeMode] = useState(false);
    const [targetLetter, setTargetLetter] = useState<string>("A");
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<string>("");
    const [feedbackLock, setFeedbackLock] = useState(false);

    // Gesture Estimator
    const gestureEstimator = useRef<any>(null);

    // Auto-start Practice Mode if requested via URL
    useEffect(() => {
        if (searchParams.get("mode") === "practice") {
            setPracticeMode(true);
            setCameraActive(true);
        }
    }, [searchParams]);

    // Initialize Prediction Smoother
    useEffect(() => {
        predictionSmoother.current = new PredictionSmoother({
            windowSize: 5,
            minConfidence: 0.70,
            minAgreementRatio: 0.6,
            stabilityDurationMs: 400
        });
    }, []);

    // Load Handpose Model
    useEffect(() => {
        const loadModel = async () => {
            try {
                setIsModelLoading(true);
                setModelError(null);

                // Set TensorFlow.js backend
                await tf.setBackend("webgl");
                await tf.ready();

                // Load Handpose model
                const model = await handpose.load();
                setHandposeModel(model);

                // Initialize Fingerpose gesture estimator with ASL gestures
                gestureEstimator.current = new fp.GestureEstimator(ASL_GESTURES);

                setIsModelLoading(false);
                console.log("Handpose model loaded successfully!");
            } catch (error) {
                console.error("Failed to load Handpose model:", error);
                setModelError("Failed to load hand detection model. Please refresh the page.");
                setIsModelLoading(false);
            }
        };
        loadModel();
    }, []);

    // Detect hand and classify gesture (raw prediction)
    const detectGesture = useCallback(async (video: HTMLVideoElement): Promise<{
        letter: string;
        confidence: number;
        handFound: boolean;
    }> => {
        if (!handposeModel || !gestureEstimator.current) {
            return { letter: "None", confidence: 0, handFound: false };
        }

        try {
            // Detect hand landmarks
            const predictions = await handposeModel.estimateHands(video);

            if (predictions.length === 0) {
                return { letter: "None", confidence: 0, handFound: false };
            }

            // Get landmarks from first detected hand
            const landmarks = predictions[0].landmarks;

            // Estimate gesture using Fingerpose with higher confidence threshold
            const estimatedGestures = gestureEstimator.current.estimate(landmarks, 7.0);

            if (estimatedGestures.gestures.length === 0) {
                return { letter: "?", confidence: 0, handFound: true };
            }

            // Find gesture with highest confidence
            const bestGesture = estimatedGestures.gestures.reduce(
                (prev: { name: string; score: number }, curr: { name: string; score: number }) =>
                    prev.score > curr.score ? prev : curr
            );

            return {
                letter: bestGesture.name,
                confidence: bestGesture.score / 10, // Normalize to 0-1
                handFound: true
            };
        } catch (error) {
            console.error("Detection error:", error);
            return { letter: "Error", confidence: 0, handFound: false };
        }
    }, [handposeModel]);

    // Practice Mode Logic - Check if STABLE prediction matches target
    useEffect(() => {
        if (!practiceMode || feedbackLock) return;

        // Only trigger success on STABLE predictions with high confidence
        if (stableResult.isStable &&
            stableResult.letter === targetLetter &&
            stableResult.confidence >= 0.70) {
            handleSuccess();
        }
    }, [stableResult, practiceMode, targetLetter, feedbackLock]);

    const handleSuccess = () => {
        setFeedbackLock(true);
        setFeedback("Correct! 🎉");
        setScore(s => s + 10);

        // Reset smoother to prepare for next letter
        predictionSmoother.current?.reset();

        // Delay to show feedback before switching
        setTimeout(() => {
            setFeedback("");
            setFeedbackLock(false);
            // Pick next random letter from detectable set
            const nextLetter = DETECTABLE_LETTERS[Math.floor(Math.random() * DETECTABLE_LETTERS.length)];
            setTargetLetter(nextLetter);
        }, 1500);
    };

    const togglePracticeMode = () => {
        if (!practiceMode) {
            setPracticeMode(true);
            setCameraActive(true);
            setScore(0);
            setTargetLetter("A");
            predictionSmoother.current?.reset();
        } else {
            setPracticeMode(false);
        }
    };

    // Camera & Detection Loop with Smoothing
    useEffect(() => {
        let stream: MediaStream | null = null;
        let animationFrameId: number = 0;
        let lastDetectionTime = 0;
        const DETECTION_INTERVAL = 100; // Detect every 100ms for smoother experience

        const detectLoop = async () => {
            if (videoRef.current && handposeModel && cameraActive) {
                if (videoRef.current.readyState === 4) {
                    const now = Date.now();
                    if (now - lastDetectionTime > DETECTION_INTERVAL) {
                        lastDetectionTime = now;

                        // Get raw prediction
                        const rawResult = await detectGesture(videoRef.current);
                        setHandDetected(rawResult.handFound);

                        // Apply smoothing
                        if (predictionSmoother.current) {
                            const smoothed = predictionSmoother.current.addPrediction(
                                rawResult.letter,
                                rawResult.confidence
                            );
                            setStableResult(smoothed);
                        }
                    }
                }
            }
            animationFrameId = requestAnimationFrame(detectLoop);
        };

        if (cameraActive) {
            navigator.mediaDevices
                .getUserMedia({ video: { width: 640, height: 480 } })
                .then((s) => {
                    stream = s;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                        setTimeout(detectLoop, 500);
                    }
                })
                .catch((err) => console.error("Camera Error:", err));
        } else {
            if (videoRef.current) videoRef.current.srcObject = null;
            cancelAnimationFrame(animationFrameId);
            setHandDetected(false);
            predictionSmoother.current?.reset();
        }

        return () => {
            if (stream) stream.getTracks().forEach((track) => track.stop());
            cancelAnimationFrame(animationFrameId);
        };
    }, [cameraActive, handposeModel, detectGesture]);

    const toggleCamera = () => setCameraActive(!cameraActive);

    // Get UI state based on stable result
    const getDetectionBadge = () => {
        if (!handDetected) {
            return (
                <span className="ml-2 px-2 py-0.5 rounded text-sm flex items-center gap-1 bg-amber-500/20 text-amber-300">
                    <Hand className="w-3 h-3" />
                    Show Hand
                </span>
            );
        }

        if (!stableResult.isStable) {
            return (
                <span className="ml-2 px-2 py-0.5 rounded text-sm flex items-center gap-1 bg-blue-500/20 text-blue-300">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {stableResult.letter !== "?" ? `${stableResult.letter}...` : "Detecting..."}
                </span>
            );
        }

        return (
            <span className="ml-2 px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-sm font-bold">
                ✓ {stableResult.letter} ({Math.round(stableResult.confidence * 100)}%)
            </span>
        );
    };

    return (
        <div className="h-[calc(100vh-4rem)] p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50 dark:bg-slate-950">

            {/* Left Panel: The Avatar Mentor OR Practice Target */}
            <Card className="relative overflow-hidden border-2 border-indigo-100 dark:border-indigo-900 shadow-xl rounded-3xl h-full flex flex-col">
                <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                        {practiceMode ? "Practice Challenge" : "AI Mentor"}
                    </h2>
                </div>

                {practiceMode && (
                    <div className="absolute top-4 right-4 z-10 bg-indigo-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
                        Score: {score} XP
                    </div>
                )}

                <div className="flex-1 w-full relative bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
                    {practiceMode ? (
                        <div className="flex flex-col items-center gap-6">
                            <div className="relative w-64 h-64 bg-white rounded-2xl p-4 shadow-2xl rotate-3 transition-transform hover:rotate-0 flex items-center justify-center">
                                <NextImage
                                    src={`/asl-data/${targetLetter}.jpg`}
                                    alt={`Sign for ${targetLetter}`}
                                    width={256}
                                    height={256}
                                    className="w-full h-full object-contain"
                                    priority
                                    onError={(e: any) => console.error(`Failed to load ASL image for ${targetLetter}`, e)}
                                />
                            </div>
                            <div className="text-center">
                                <p className="text-slate-400 mb-2">Sign this letter:</p>
                                <h1 className="text-6xl font-black text-white">{targetLetter}</h1>
                                {(targetLetter === "J" || targetLetter === "Z") && (
                                    <p className="text-amber-400 text-sm mt-2">⚠️ This letter requires motion</p>
                                )}
                            </div>

                            {/* Feedback overlay */}
                            {feedback && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-50 animate-in fade-in zoom-in">
                                    <h1 className="text-6xl font-bold text-green-400 drop-shadow-lg">{feedback}</h1>
                                </div>
                            )}

                            {/* Detection hint when wrong sign detected */}
                            {!feedback && stableResult.isStable && stableResult.letter !== targetLetter && stableResult.letter !== "?" && (
                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-amber-600/90 text-white px-4 py-2 rounded-full text-sm font-medium">
                                    That looks like "{stableResult.letter}" — try "{targetLetter}"
                                </div>
                            )}
                        </div>
                    ) : (
                        <Canvas camera={{ position: [0, 1.5, 4], fov: 50 }}>
                            <ambientLight intensity={0.5} />
                            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                            <pointLight position={[-10, -10, -10]} />
                            <Environment preset="city" />

                            <SignLanguageAvatar isSigning={isSigning} />
                            <OrbitControls enableZoom={false} maxPolarAngle={Math.PI / 1.5} />
                        </Canvas>
                    )}
                </div>

                {/* Controls */}
                <div className="p-4 bg-white dark:bg-slate-900 border-t flex gap-4 items-center justify-between">
                    {!practiceMode && (
                        <div className="flex-1 flex gap-2">
                            <input
                                type="text"
                                placeholder="Type to translate to sign..."
                                className="flex-1 px-4 py-2 rounded-lg border bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <Button
                                onClick={() => setIsSigning(!isSigning)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                            >
                                {isSigning ? <Pause className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
                                {isSigning ? "Stop" : "Translate"}
                            </Button>
                        </div>
                    )}

                    <Button
                        onClick={togglePracticeMode}
                        variant={practiceMode ? "secondary" : "default"}
                        className="ml-auto"
                        disabled={isModelLoading || !!modelError}
                    >
                        {practiceMode ? "Exit Practice" : "Start Practice Mode"}
                    </Button>
                </div>
            </Card>

            {/* Right Panel: Mirror Mode (Student) */}
            <Card className="relative overflow-hidden border-2 border-emerald-100 dark:border-emerald-900 shadow-xl rounded-3xl h-full flex flex-col items-center justify-center bg-black">
                <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur px-4 py-2 rounded-full border border-white/10 text-emerald-400 font-semibold flex items-center gap-2 flex-wrap">
                    <div className={`w-3 h-3 rounded-full ${cameraActive ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                    {practiceMode ? "Your Camera" : "Mirror Mode"}

                    {cameraActive && handposeModel && getDetectionBadge()}
                </div>

                {cameraActive ? (
                    <div className="relative w-full h-full">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            className="w-full h-full object-cover transform scale-x-[-1]"
                        />

                        {/* Status overlay */}
                        {handposeModel && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-center">
                                <p className={`text-sm font-medium ${stableResult.isStable ? "text-emerald-400" :
                                    handDetected ? "text-blue-400" : "text-amber-400"
                                    }`}>
                                    {stableResult.feedbackMessage}
                                </p>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-slate-500 px-8">
                        {isModelLoading ? (
                            <div className="flex flex-col items-center animate-pulse">
                                <div className="h-12 w-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <p className="text-lg font-medium">Loading Hand Detection...</p>
                                <p className="text-sm text-slate-400 mt-2">This may take a few seconds</p>
                            </div>
                        ) : modelError ? (
                            <div className="flex flex-col items-center text-amber-500">
                                <AlertCircle className="w-16 h-16 mb-4" />
                                <p className="text-lg font-medium mb-2">Model Error</p>
                                <p className="text-sm text-slate-400 max-w-sm">{modelError}</p>
                            </div>
                        ) : (
                            <>
                                <CameraOff className="w-20 h-20 mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Camera is inactive</p>
                                <p className="text-sm text-slate-400 mt-2">Click below to start</p>
                            </>
                        )}
                    </div>
                )}

                <div className="absolute bottom-8">
                    <Button
                        onClick={toggleCamera}
                        variant={cameraActive ? "destructive" : "default"}
                        size="lg"
                        className="rounded-full px-8 shadow-lg"
                        disabled={isModelLoading || !!modelError}
                    >
                        {cameraActive ? "Stop Camera" : "Start Camera"}
                    </Button>
                </div>
            </Card>
        </div>
    );
}
