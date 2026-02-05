import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface ZeroGravityGroupProps {
    children: React.ReactNode;
    /** Multiplier for the vertical bobbing intensity. Default: 1 */
    floatIntensity?: number;
    /** Multiplier for the random rotation intensity. Default: 1 */
    rotationIntensity?: number;
    /** Speed of the simulation. Default: 1 */
    speed?: number;
    /**
     * Strength of the "Parallax Drift" when mouse is near.
     * Higher values mean the object moves further away from the cursor.
     * Default: 1.
     */
    driftIntensity?: number;
}

export const ZeroGravityGroup = ({
    children,
    floatIntensity = 1,
    rotationIntensity = 1,
    speed = 1,
    driftIntensity = 1,
}: ZeroGravityGroupProps) => {
    const groupRef = useRef<THREE.Group>(null);

    // Random offsets to ensure multiple instances don't move in perfect sync
    const timeOffset = useRef(Math.random() * 100);
    const rotationOffset = useRef({
        x: Math.random() * Math.PI,
        z: Math.random() * Math.PI,
    });

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const t = state.clock.getElapsedTime() * speed + timeOffset.current;

        // 1. Floating Effect (Oscillation)
        // Vertical Bobbing (Y-axis)
        const floatY = Math.sin(t / 2) * 0.1 * floatIntensity;

        // 2. Drifting Rotation
        // Gentle rotation on X and Z axes to simulate weightlessness
        const rotX = Math.sin(t / 3 + rotationOffset.current.x) * 0.05 * rotationIntensity;
        const rotZ = Math.cos(t / 2 + rotationOffset.current.z) * 0.05 * rotationIntensity;

        // 3. Mouse Interaction (Parallax Drift / Repulsion)
        // We get the normalized mouse coordinates (-1 to 1) from state.pointer
        const mouse = state.pointer;

        // Calculate a target displacement away from the mouse
        // If mouse is at top-left (-1, 1), we drift slightly bottom-right
        const targetX = -mouse.x * 0.5 * driftIntensity;
        const targetY = -mouse.y * 0.5 * driftIntensity;

        // Smoothly interpolate current position to target physics state
        // We use dampening for a "fluid" feel
        const smoothness = 5 * delta; // Adjust 5 for snappiness

        // Apply Floating + Drift to Position
        // We maintain the object's base position (0,0,0 relative to parent) but add our effects
        groupRef.current.position.x = THREE.MathUtils.lerp(
            groupRef.current.position.x,
            targetX,
            smoothness
        );

        // For Y, we combine the bobbing sine wave with the mouse drift
        // Note: We apply the sine wave directly to the target for the lerp to track it smoothly,
        // or adding it after. Adding it after keeps the bobbing constant even during drift.
        const currentBaseY = groupRef.current.position.y;
        const targetTotalY = floatY + targetY;

        groupRef.current.position.y = THREE.MathUtils.lerp(
            currentBaseY,
            targetTotalY,
            smoothness
        );

        // Apply Rotation
        groupRef.current.rotation.x = THREE.MathUtils.lerp(
            groupRef.current.rotation.x,
            rotX - mouse.y * 0.1 * driftIntensity, // Slight tilt based on mouse Y
            smoothness
        );

        groupRef.current.rotation.z = THREE.MathUtils.lerp(
            groupRef.current.rotation.z,
            rotZ + mouse.x * 0.1 * driftIntensity, // Slight tilt based on mouse X
            smoothness
        );
    });

    return <group ref={groupRef}>{children}</group>;
};
