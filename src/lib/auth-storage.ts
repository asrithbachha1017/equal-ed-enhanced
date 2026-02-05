/**
 * Auth Storage Utility
 * 
 * Manages localStorage persistence for role-based login.
 * Stores minimal profile data for "remember me" functionality.
 */

export type UserRole = 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';

export interface SavedStudentProfile {
    role: 'STUDENT';
    name: string;
    rollNumber: string;
    classGrade: string;
    section: string;
    school: string;
}

export interface SavedTeacherProfile {
    role: 'TEACHER';
    name: string;
    facultyId: string;
    subjects: string[];
    department: string;
    institution: string;
}

export interface SavedParentProfile {
    role: 'PARENT';
    parentName: string;
    studentName: string;
    studentRollNumber: string;
    relationship: string;
}

export interface SavedAdminProfile {
    role: 'ADMIN';
    name: string;
    adminId: string;
    organization: string;
}

export type SavedProfile = SavedStudentProfile | SavedTeacherProfile | SavedParentProfile | SavedAdminProfile;

const STORAGE_KEY = 'equaled_user_profile';

/**
 * Save user profile to localStorage
 */
export function saveUserProfile(profile: SavedProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

/**
 * Get saved user profile from localStorage
 */
export function getSavedProfile(): SavedProfile | null {
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    try {
        return JSON.parse(stored) as SavedProfile;
    } catch {
        return null;
    }
}

/**
 * Check if user has a saved profile for a specific role
 */
export function hasSavedProfileForRole(role: UserRole): boolean {
    const profile = getSavedProfile();
    return profile?.role === role;
}

/**
 * Clear saved profile (logout)
 */
export function clearSavedProfile(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem('hasSeenIdentity');
}

/**
 * Get display name from saved profile
 */
export function getProfileDisplayName(profile: SavedProfile): string {
    switch (profile.role) {
        case 'STUDENT':
            return profile.name;
        case 'TEACHER':
            return profile.name;
        case 'PARENT':
            return profile.parentName;
        case 'ADMIN':
            return profile.name;
    }
}

/**
 * Get identifier from saved profile
 */
export function getProfileIdentifier(profile: SavedProfile): string {
    switch (profile.role) {
        case 'STUDENT':
            return profile.rollNumber;
        case 'TEACHER':
            return profile.facultyId;
        case 'PARENT':
            return profile.studentRollNumber;
        case 'ADMIN':
            return profile.adminId;
    }
}
