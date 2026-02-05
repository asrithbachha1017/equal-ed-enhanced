"use client";

import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Group } from "three";

interface SignLanguageAvatarProps {
    isSigning: boolean;
}

export const SignLanguageAvatar = ({ isSigning }: SignLanguageAvatarProps) => {
    const groupRef = useRef<Group>(null);
    const leftArmRef = useRef<Mesh>(null);
    const rightArmRef = useRef<Mesh>(null);
    const headRef = useRef<Mesh>(null);

    // Animation Loop
    useFrame((state) => {
        if (!groupRef.current) return;
        const t = state.clock.getElapsedTime();

        // Idle Breathing
        groupRef.current.position.y = Math.sin(t) * 0.1 - 1; // -1 to center loosely

        if (isSigning) {
            // Signing Animation (Mock: Waving arms)
            if (leftArmRef.current && rightArmRef.current) {
                leftArmRef.current.rotation.z = Math.sin(t * 10) * 0.5 + 0.5;
                rightArmRef.current.rotation.z = Math.sin(t * 10 + Math.PI) * 0.5 - 0.5;

                // Head bobbing
                if (headRef.current) {
                    headRef.current.rotation.y = Math.sin(t * 5) * 0.2;
                }
            }
        } else {
            // Return to Neutral
            if (leftArmRef.current) leftArmRef.current.rotation.z = 0.2;
            if (rightArmRef.current) rightArmRef.current.rotation.z = -0.2;
            if (headRef.current) headRef.current.rotation.y = 0;
        }
    });

    return (
        <group ref={groupRef} dispose={null}>
            {/* Robot Head */}
            <mesh ref={headRef} position={[0, 1.5, 0]}>
                <boxGeometry args={[0.5, 0.6, 0.5]} />
                <meshStandardMaterial color="#4f46e5" roughness={0.3} metalness={0.8} />
            </mesh>

            {/* Robot Body */}
            <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.3, 2, 8]} />
                <meshStandardMaterial color="#e0e7ff" metalness={0.5} />
            </mesh>

            {/* Left Arm (Shoulder pivot) */}
            <group position={[-0.6, 0.8, 0]}>
                <mesh ref={leftArmRef} position={[0, -0.6, 0]}>
                    <capsuleGeometry args={[0.1, 1.2, 4]} />
                    <meshStandardMaterial color="#4f46e5" />
                </mesh>
            </group>

            {/* Right Arm */}
            <group position={[0.6, 0.8, 0]}>
                <mesh ref={rightArmRef} position={[0, -0.6, 0]}>
                    <capsuleGeometry args={[0.1, 1.2, 4]} />
                    <meshStandardMaterial color="#4f46e5" />
                </mesh>
            </group>

            {/* Visor eyes */}
            <mesh position={[0, 1.5, 0.26]}>
                <planeGeometry args={[0.4, 0.15]} />
                <meshBasicMaterial color="#00ffcc" />
            </mesh>
        </group>
    );
};
