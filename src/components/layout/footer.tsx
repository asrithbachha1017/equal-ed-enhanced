/**
 * SiteFooter — Modern dark footer
 *
 * Design decisions:
 * - Dark gradient surface (site-footer CSS class) for strong visual separation
 *   from the light page body, creating a clear "end of page" cue.
 * - Three-column grid on desktop, single column on mobile.
 * - Social icon links with social-icon-btn hover animation (lift + teal tint).
 * - All social links open in a new tab with rel="noopener noreferrer".
 * - No images — icon-only social links use SVG paths inline via lucide-react,
 *   keeping bundle size at zero.
 */

import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { Github, Twitter, Linkedin, Heart } from "lucide-react";

const FOOTER_LINKS = {
    Platform: [
        { label: "Courses",        href: "/courses"       },
        { label: "Dashboard",      href: "/dashboard"     },
        { label: "Sign Language",  href: "/sign-language" },
        { label: "Math Lab",       href: "/math-lab"      },
        { label: "Saved Courses",  href: "/saved-courses" },
    ],
    Accessibility: [
        { label: "Voice Control",    href: "/accessibility"  },
        { label: "Screen Narration", href: "/accessibility"  },
        { label: "High Contrast",    href: "/accessibility"  },
        { label: "Teacher Portal",   href: "/teacher"        },
    ],
};

const SOCIAL_LINKS = [
    { icon: Github,   href: "https://github.com",   label: "GitHub"   },
    { icon: Twitter,  href: "https://twitter.com",  label: "Twitter"  },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export function SiteFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="site-footer text-slate-300" role="contentinfo">
            <div className="max-w-7xl mx-auto px-6 py-14">
                {/* ── Top grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
                    {/* Brand column */}
                    <div className="space-y-4">
                        <div className="opacity-90">
                            <Logo />
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
                            An accessible, AI-powered learning platform designed for
                            every student — regardless of ability or grade level.
                        </p>
                        {/* Social icons */}
                        <div className="flex items-center gap-3 pt-1">
                            {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="social-icon-btn w-8 h-8 rounded-md bg-white/5 border border-white/10 flex items-center justify-center opacity-60 hover:opacity-100"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Link columns */}
                    {Object.entries(FOOTER_LINKS).map(([section, links]) => (
                        <div key={section} className="space-y-4">
                            <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-0">
                                {section}
                            </h3>
                            <ul className="space-y-2.5">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-sm text-slate-400 hover:text-teal-400 transition-colors duration-150 focus-visible:outline-none focus-visible:underline"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* ── Divider ── */}
                <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                    <p>
                        © {year} EqualEd. All rights reserved.
                    </p>
                    <p className="flex items-center gap-1">
                        Built with{" "}
                        <Heart className="h-3 w-3 text-rose-400 fill-rose-400 mx-0.5" />
                        {" "}for inclusive education.
                    </p>
                </div>
            </div>
        </footer>
    );
}
