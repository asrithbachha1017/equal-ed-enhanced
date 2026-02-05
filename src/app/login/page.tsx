"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Loader2, GraduationCap, BookOpen, Users, ShieldCheck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import {
    getSavedProfile,
    saveUserProfile,
    UserRole,
    SavedStudentProfile,
    SavedTeacherProfile,
    SavedParentProfile,
    SavedAdminProfile,
    SavedProfile,
    getProfileDisplayName,
    getProfileIdentifier
} from "@/lib/auth-storage";

const ROLE_CONFIG = {
    student: {
        title: 'Student Login',
        icon: <GraduationCap className="w-6 h-6" />,
        color: 'text-blue-600',
        bgColor: 'bg-blue-500/10'
    },
    teacher: {
        title: 'Teacher Login',
        icon: <BookOpen className="w-6 h-6" />,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-500/10'
    },
    parent: {
        title: 'Parent Login',
        icon: <Users className="w-6 h-6" />,
        color: 'text-purple-600',
        bgColor: 'bg-purple-500/10'
    },
    admin: {
        title: 'Admin Login',
        icon: <ShieldCheck className="w-6 h-6" />,
        color: 'text-amber-600',
        bgColor: 'bg-amber-500/10'
    }
};

function LoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const roleParam = (searchParams.get('role') || 'student').toUpperCase() as UserRole;
    const isQuickLogin = searchParams.get('quick') === 'true';

    const [role, setRole] = useState<UserRole>(roleParam);
    const [savedProfile, setSavedProfile] = useState<SavedProfile | null>(null);
    const [isFirstTime, setIsFirstTime] = useState(true);
    const [loading, setLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Form states
    const [formData, setFormData] = useState({
        // Student
        name: '',
        rollNumber: '',
        classGrade: '',
        section: '',
        school: '',
        // Teacher
        facultyId: '',
        subjects: '',
        department: '',
        institution: '',
        // Parent
        parentName: '',
        studentName: '',
        studentRollNumber: '',
        relationship: '',
        // Admin
        adminId: '',
        organization: ''
    });

    const firstInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
        const profile = getSavedProfile();
        setSavedProfile(profile);

        if (profile && profile.role === role) {
            setIsFirstTime(false);
            // Pre-fill form with saved data
            if (profile.role === 'STUDENT') {
                setFormData(prev => ({
                    ...prev,
                    name: profile.name,
                    rollNumber: profile.rollNumber
                }));
            } else if (profile.role === 'TEACHER') {
                setFormData(prev => ({
                    ...prev,
                    name: profile.name,
                    facultyId: profile.facultyId
                }));
            } else if (profile.role === 'PARENT') {
                setFormData(prev => ({
                    ...prev,
                    parentName: profile.parentName,
                    studentRollNumber: profile.studentRollNumber
                }));
            } else if (profile.role === 'ADMIN') {
                setFormData(prev => ({
                    ...prev,
                    name: profile.name,
                    adminId: profile.adminId
                }));
            }
        } else {
            setIsFirstTime(true);
        }
    }, [role]);

    useEffect(() => {
        if (mounted) {
            firstInputRef.current?.focus();
        }
    }, [mounted, isFirstTime]);

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Save profile to localStorage
            let profileToSave: SavedProfile;

            switch (role) {
                case 'STUDENT':
                    profileToSave = {
                        role: 'STUDENT',
                        name: formData.name,
                        rollNumber: formData.rollNumber,
                        classGrade: formData.classGrade || 'Grade 5',
                        section: formData.section || 'A',
                        school: formData.school || 'EqualEd School'
                    } as SavedStudentProfile;
                    break;
                case 'TEACHER':
                    profileToSave = {
                        role: 'TEACHER',
                        name: formData.name,
                        facultyId: formData.facultyId,
                        subjects: formData.subjects ? formData.subjects.split(',').map(s => s.trim()) : ['General'],
                        department: formData.department || 'Education',
                        institution: formData.institution || 'EqualEd School'
                    } as SavedTeacherProfile;
                    break;
                case 'PARENT':
                    profileToSave = {
                        role: 'PARENT',
                        parentName: formData.parentName,
                        studentName: formData.studentName || 'Student',
                        studentRollNumber: formData.studentRollNumber,
                        relationship: formData.relationship || 'Parent'
                    } as SavedParentProfile;
                    break;
                case 'ADMIN':
                    profileToSave = {
                        role: 'ADMIN',
                        name: formData.name,
                        adminId: formData.adminId,
                        organization: formData.organization || 'EqualEd'
                    } as SavedAdminProfile;
                    break;
            }

            saveUserProfile(profileToSave);

            // Attempt NextAuth login with demo credentials based on role
            const username = role.toLowerCase();
            const password = role.toLowerCase();

            const result = await signIn("credentials", {
                redirect: false,
                username,
                password
            });

            if (result?.error) {
                // For demo: still proceed even if NextAuth fails
                toast.success("Welcome!", { description: `Logged in as ${role}` });
            } else {
                toast.success("Login Successful!", { description: "Redirecting to dashboard..." });
            }

            // Route based on role
            switch (role) {
                case 'STUDENT':
                    router.push('/dashboard');
                    break;
                case 'TEACHER':
                    router.push('/teacher');
                    break;
                case 'PARENT':
                    router.push('/dashboard');  // Parent dashboard
                    break;
                case 'ADMIN':
                    router.push('/teacher');  // Admin dashboard
                    break;
            }
            router.refresh();
        } catch (error) {
            console.error('Login error:', error);
            toast.error("Login Failed", { description: "Please try again." });
            setLoading(false);
        }
    };

    const config = ROLE_CONFIG[role.toLowerCase() as keyof typeof ROLE_CONFIG];

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col items-center justify-center p-6">

            {/* Back Button */}
            <div className="w-full max-w-md mb-4">
                <Link href="/login/role-select" className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                    <span>Change Role</span>
                </Link>
            </div>

            <Card className="w-full max-w-md shadow-2xl border-slate-200 dark:border-slate-800 glass-morphism">
                <CardHeader className="text-center pb-2">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${config.bgColor} ${config.color} mx-auto mb-4`}>
                        {config.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold">{config.title}</CardTitle>
                    <CardDescription>
                        {isFirstTime
                            ? "First time? Complete your registration below."
                            : "Welcome back! Verify your identity to continue."
                        }
                    </CardDescription>

                    {/* Toggle between first-time and returning */}
                    <div className="flex justify-center gap-2 mt-4">
                        <Button
                            variant={isFirstTime ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsFirstTime(true)}
                        >
                            New User
                        </Button>
                        <Button
                            variant={!isFirstTime ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsFirstTime(false)}
                            disabled={!savedProfile || savedProfile.role !== role}
                        >
                            Returning User
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-4">

                        {/* STUDENT FORM */}
                        {role === 'STUDENT' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        ref={firstInputRef}
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="rollNumber">Roll Number *</Label>
                                    <Input
                                        id="rollNumber"
                                        placeholder="e.g., STU2024001"
                                        value={formData.rollNumber}
                                        onChange={(e) => handleInputChange('rollNumber', e.target.value)}
                                        required
                                    />
                                </div>
                                {isFirstTime && (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="classGrade">Class / Grade</Label>
                                                <Select
                                                    value={formData.classGrade}
                                                    onValueChange={(v) => handleInputChange('classGrade', v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(g => (
                                                            <SelectItem key={g} value={`Grade ${g}`}>Grade {g}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="section">Section</Label>
                                                <Select
                                                    value={formData.section}
                                                    onValueChange={(v) => handleInputChange('section', v)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {['A', 'B', 'C', 'D', 'E'].map(s => (
                                                            <SelectItem key={s} value={s}>Section {s}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="school">School / Institution</Label>
                                            <Input
                                                id="school"
                                                placeholder="Enter your school name"
                                                value={formData.school}
                                                onChange={(e) => handleInputChange('school', e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* TEACHER FORM */}
                        {role === 'TEACHER' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        ref={firstInputRef}
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="facultyId">Faculty ID *</Label>
                                    <Input
                                        id="facultyId"
                                        placeholder="e.g., FAC2024001"
                                        value={formData.facultyId}
                                        onChange={(e) => handleInputChange('facultyId', e.target.value)}
                                        required
                                    />
                                </div>
                                {isFirstTime && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="subjects">Subject(s)</Label>
                                            <Input
                                                id="subjects"
                                                placeholder="e.g., Math, Science"
                                                value={formData.subjects}
                                                onChange={(e) => handleInputChange('subjects', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="department">Department</Label>
                                            <Input
                                                id="department"
                                                placeholder="e.g., Science Department"
                                                value={formData.department}
                                                onChange={(e) => handleInputChange('department', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="institution">Institution</Label>
                                            <Input
                                                id="institution"
                                                placeholder="Enter your institution"
                                                value={formData.institution}
                                                onChange={(e) => handleInputChange('institution', e.target.value)}
                                            />
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* PARENT FORM */}
                        {role === 'PARENT' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="parentName">Your Name *</Label>
                                    <Input
                                        id="parentName"
                                        ref={firstInputRef}
                                        placeholder="Enter your full name"
                                        value={formData.parentName}
                                        onChange={(e) => handleInputChange('parentName', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="studentRollNumber">Student Roll Number *</Label>
                                    <Input
                                        id="studentRollNumber"
                                        placeholder="Your child's roll number"
                                        value={formData.studentRollNumber}
                                        onChange={(e) => handleInputChange('studentRollNumber', e.target.value)}
                                        required
                                    />
                                </div>
                                {isFirstTime && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="studentName">Student Name</Label>
                                            <Input
                                                id="studentName"
                                                placeholder="Your child's name"
                                                value={formData.studentName}
                                                onChange={(e) => handleInputChange('studentName', e.target.value)}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="relationship">Relationship</Label>
                                            <Select
                                                value={formData.relationship}
                                                onValueChange={(v) => handleInputChange('relationship', v)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select relationship" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Mother">Mother</SelectItem>
                                                    <SelectItem value="Father">Father</SelectItem>
                                                    <SelectItem value="Guardian">Guardian</SelectItem>
                                                    <SelectItem value="Other">Other</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}
                            </>
                        )}

                        {/* ADMIN FORM */}
                        {role === 'ADMIN' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        ref={firstInputRef}
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="adminId">Admin ID *</Label>
                                    <Input
                                        id="adminId"
                                        placeholder="e.g., ADM2024001"
                                        value={formData.adminId}
                                        onChange={(e) => handleInputChange('adminId', e.target.value)}
                                        required
                                    />
                                </div>
                                {isFirstTime && (
                                    <div className="space-y-2">
                                        <Label htmlFor="organization">Organization</Label>
                                        <Input
                                            id="organization"
                                            placeholder="Enter your organization"
                                            value={formData.organization}
                                            onChange={(e) => handleInputChange('organization', e.target.value)}
                                        />
                                    </div>
                                )}
                            </>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 text-lg font-semibold mt-6"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Signing In...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                    {isFirstTime ? "Register & Login" : "Login"}
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Demo Credentials */}
            <p className="mt-6 text-sm text-slate-500 dark:text-slate-400 text-center">
                Demo: Use <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">student/student</code> or <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">teacher/teacher</code>
            </p>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
