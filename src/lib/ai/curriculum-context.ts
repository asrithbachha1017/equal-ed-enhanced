/**
 * Curriculum Context Service
 * Loads and provides educational content context for the AI tutor
 * based on the current course, module, and lesson.
 */

import { MOCK_DB, MockCourse, MockModule, MockLevel } from '../mock-db';

export interface CurriculumContext {
    courseId: string;
    courseTitle: string;
    subject: string;
    gradeLevel?: number;
    currentTopic: string;
    moduleContent: string;
    learningObjectives: string[];
    relatedConcepts: string[];
    aiMetadata?: {
        modelName: string;
        confidenceScore: number;
    };
}

export interface SubjectPromptConfig {
    systemPromptAddition: string;
    exampleFormats: string[];
    forbiddenPatterns: string[];
    specialInstructions: string;
}

/**
 * Get curriculum context for the tutor based on route/course info
 */
export function getCurriculumContext(
    courseId?: string,
    moduleId?: string,
    pathname?: string
): CurriculumContext | null {
    // Try to find course by ID first
    let course = courseId ? MOCK_DB.getCourseById(courseId) : null;

    // If no course ID, try to infer from pathname
    if (!course && pathname) {
        const pathLower = pathname.toLowerCase();
        if (pathLower.includes('math')) {
            course = MOCK_DB.getCourseById('course-math');
        } else if (pathLower.includes('science')) {
            course = MOCK_DB.getCourseById('course-science');
        } else if (pathLower.includes('asl') || pathLower.includes('sign')) {
            course = MOCK_DB.getCourseById('course-asl');
        }
    }

    if (!course) {
        return null;
    }

    // Find specific module if provided
    let targetModule: MockModule | undefined;
    let targetLevel: MockLevel | undefined;

    for (const level of course.levels) {
        const found = level.modules.find(m => m.id === moduleId);
        if (found) {
            targetModule = found;
            targetLevel = level;
            break;
        }
    }

    // Build module content from available modules
    const moduleContent = targetModule?.content ||
        course.levels.flatMap((l: MockLevel) => l.modules.map((m: MockModule) => m.content)).join('\n\n');

    // Determine subject from course title
    const subject = inferSubject(course.title);

    return {
        courseId: course.id,
        courseTitle: course.title,
        subject,
        currentTopic: targetModule?.title || targetLevel?.title || course.title,
        moduleContent,
        learningObjectives: course.learningObjectives || [],
        relatedConcepts: extractRelatedConcepts(course),
        aiMetadata: course.aiMetadata ? {
            modelName: course.aiMetadata.modelName,
            confidenceScore: course.aiMetadata.confidenceScore
        } : undefined
    };
}

/**
 * Get subject-specific prompt configuration
 */
export function getSubjectPromptConfig(subject: string): SubjectPromptConfig {
    const configs: Record<string, SubjectPromptConfig> = {
        'mathematics': {
            systemPromptAddition: `
You are specifically tutoring Mathematics. Apply these math-specific guidelines:

1. **Step-by-Step Problem Solving**:
   - Always show work in numbered steps
   - Use clear mathematical notation
   - Highlight intermediate results

2. **Mathematical Explanation Style**:
   - Start with the concept/formula name
   - Explain WHY the formula works
   - Show a worked example
   - Offer a practice variation

3. **Error Correction**:
   - When students make mistakes, identify the specific error
   - Show the correct approach without shame
   - Reinforce the correct method with another example

4. **Visual Representations**:
   - Describe number lines, graphs, or diagrams verbally
   - Use ASCII art sparingly for simple visualizations
   - Reference real-world objects for scale/proportion`,
            exampleFormats: [
                'Step 1: [Setup]\nStep 2: [Operation]\nStep 3: [Result]',
                'Formula: [Name]\nMeaning: [Explanation]\nExample: [Worked problem]'
            ],
            forbiddenPatterns: [
                'Just multiply...',
                'Obviously...',
                'Simply calculate...'
            ],
            specialInstructions: 'Always verify calculations mentally before presenting. For word problems, first identify what is being asked.'
        },

        'science': {
            systemPromptAddition: `
You are specifically tutoring Science. Apply these science-specific guidelines:

1. **Scientific Method Focus**:
   - Encourage hypothesis formation
   - Distinguish observation from inference
   - Emphasize evidence-based reasoning

2. **Explanation Structure**:
   - What: Define the concept
   - Why: Explain the underlying principle
   - How: Describe the mechanism
   - Example: Provide a real-world instance

3. **Experimental Thinking**:
   - Suggest simple safe experiments when relevant
   - Explain variables (independent, dependent, controlled)
   - Discuss prediction vs. observation

4. **Connection Building**:
   - Link concepts to everyday phenomena
   - Show connections between science domains
   - Reference current scientific discoveries (age-appropriate)`,
            exampleFormats: [
                'Concept: [Name]\nPrinciple: [Why it happens]\nExample: [Observable instance]',
                'Hypothesis: If [cause], then [effect]\nEvidence: [Observations]\nConclusion: [Finding]'
            ],
            forbiddenPatterns: [
                'Just because...',
                'Scientists believe...',
                'It\'s obvious that...'
            ],
            specialInstructions: 'Encourage curiosity. When students ask "why?", always provide an explanation rather than just facts.'
        },

        'asl': {
            systemPromptAddition: `
You are specifically tutoring American Sign Language (ASL). Apply these ASL-specific guidelines:

1. **Visual Learning Emphasis**:
   - Describe hand shapes precisely using technical terms
   - Reference handshape classifications (A, B, C, etc.)
   - Explain palm orientation and movement direction

2. **Sign Description Format**:
   - Dominant hand position and shape
   - Non-dominant hand (if used)
   - Starting location on body/space
   - Movement direction and type
   - Facial expression component

3. **Cultural Context**:
   - Include Deaf culture context when relevant
   - Explain when signs vary regionally
   - Distinguish ASL grammar from English grammar

4. **Practice Guidance**:
   - Encourage mirror practice
   - Suggest finger spelling drills
   - Recommend watching the camera for self-review`,
            exampleFormats: [
                'Sign: [Word]\nHandshape: [Letter/description]\nLocation: [Where]\nMovement: [How]\nExpression: [Face]',
                'Vocabulary Group: [Category]\nSigns: [List with brief descriptions]'
            ],
            forbiddenPatterns: [
                'Just wave your hand...',
                'It\'s like miming...',
                'Deaf and dumb...'
            ],
            specialInstructions: 'Always use person-first or identity-first language as appropriate. ASL is a complete language, not "gestures" or "hand signals".'
        },

        'general': {
            systemPromptAddition: `
You are providing general educational tutoring. Focus on:

1. **Clear Explanations**:
   - Use simple language first, then introduce terminology
   - Provide multiple examples
   - Check understanding before proceeding

2. **Active Learning**:
   - Ask guiding questions
   - Encourage the student to explain back
   - Celebrate correct reasoning

3. **Scaffolded Support**:
   - Start with what the student knows
   - Build connections to new concepts
   - Summarize key takeaways`,
            exampleFormats: [
                'Concept: [Name]\nSimple explanation: [Accessible version]\nExample: [Relatable instance]'
            ],
            forbiddenPatterns: [
                'Obviously...',
                'You should know...',
                'Just remember...'
            ],
            specialInstructions: 'Adapt language complexity to the student\'s demonstrated level.'
        }
    };

    const normalizedSubject = subject.toLowerCase();

    if (normalizedSubject.includes('math')) return configs.mathematics;
    if (normalizedSubject.includes('science')) return configs.science;
    if (normalizedSubject.includes('asl') || normalizedSubject.includes('sign')) return configs.asl;

    return configs.general;
}

/**
 * Build enhanced system prompt with curriculum context
 */
export function buildEnhancedPrompt(
    basePrompt: string,
    curriculumContext: CurriculumContext | null,
    subjectConfig: SubjectPromptConfig
): string {
    let enhanced = basePrompt;

    // Add subject-specific instructions
    enhanced += '\n\n' + subjectConfig.systemPromptAddition;

    // Add curriculum context if available
    if (curriculumContext) {
        enhanced += `\n\n## Current Learning Context
- **Course**: ${curriculumContext.courseTitle}
- **Current Topic**: ${curriculumContext.currentTopic}
- **Subject Area**: ${curriculumContext.subject}

### Learning Objectives for this Course:
${curriculumContext.learningObjectives.map(obj => `- ${obj}`).join('\n')}

### Related Concepts the Student May Ask About:
${curriculumContext.relatedConcepts.map(c => `- ${c}`).join('\n')}

### Available Content Context:
${curriculumContext.moduleContent.slice(0, 2000)}${curriculumContext.moduleContent.length > 2000 ? '...' : ''}
`;
    }

    // Add format guidance
    enhanced += `\n\n## Response Format Examples:
${subjectConfig.exampleFormats.map(f => `\`\`\`\n${f}\n\`\`\``).join('\n')}`;

    // Add restrictions
    if (subjectConfig.forbiddenPatterns.length > 0) {
        enhanced += `\n\n## Avoid These Phrases:
${subjectConfig.forbiddenPatterns.map(p => `- "${p}"`).join('\n')}`;
    }

    return enhanced;
}

// Helper functions

function inferSubject(courseTitle: string): string {
    const title = courseTitle.toLowerCase();
    if (title.includes('math')) return 'Mathematics';
    if (title.includes('science')) return 'Science';
    if (title.includes('sign') || title.includes('asl')) return 'American Sign Language';
    if (title.includes('reading') || title.includes('english')) return 'English Language Arts';
    if (title.includes('history') || title.includes('social')) return 'Social Studies';
    return 'General Education';
}

function extractRelatedConcepts(course: MockCourse): string[] {
    const concepts: string[] = [];

    // Extract from levels
    for (const level of course.levels) {
        concepts.push(level.title);
        if (level.dataset) {
            concepts.push(level.dataset.usage);
        }
        for (const module of level.modules) {
            concepts.push(module.title);
        }
    }

    // Extract from learning objectives keywords
    for (const objective of course.learningObjectives || []) {
        // Extract key noun phrases (simplified extraction)
        const words = objective.split(/\s+/);
        for (const word of words) {
            if (word.length > 6 && !['understand', 'learning', 'develop'].includes(word.toLowerCase())) {
                concepts.push(word);
            }
        }
    }

    // Deduplicate and limit
    return [...new Set(concepts)].slice(0, 10);
}

/**
 * Get relevant content chunks for RAG-style retrieval
 */
export function getRelevantContentChunks(
    query: string,
    courseId?: string,
    maxChunks: number = 3
): string[] {
    const chunks: { text: string; relevance: number }[] = [];

    const queryTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 3);

    const courses = courseId
        ? [MOCK_DB.getCourseById(courseId)].filter(Boolean) as MockCourse[]
        : MOCK_DB.courses;

    for (const course of courses) {
        // Add course description
        if (course.description) {
            const relevance = calculateRelevance(course.description, queryTerms);
            if (relevance > 0) {
                chunks.push({ text: `Course: ${course.title}\n${course.description}`, relevance });
            }
        }

        // Add intro video script if available
        if (course.introVideo?.script) {
            const relevance = calculateRelevance(course.introVideo.script, queryTerms);
            if (relevance > 0) {
                chunks.push({ text: `Introduction to ${course.title}:\n${course.introVideo.script}`, relevance });
            }
        }

        // Add learning objectives
        if (course.learningObjectives?.length) {
            const objText = course.learningObjectives.join('\n');
            const relevance = calculateRelevance(objText, queryTerms);
            if (relevance > 0) {
                chunks.push({
                    text: `Learning Objectives for ${course.title}:\n${course.learningObjectives.map(o => `• ${o}`).join('\n')}`,
                    relevance
                });
            }
        }

        // Add module content
        for (const level of course.levels) {
            for (const module of level.modules) {
                if (module.content) {
                    const relevance = calculateRelevance(module.content, queryTerms);
                    if (relevance > 0) {
                        chunks.push({
                            text: `${module.title} (${course.title}):\n${module.content}`,
                            relevance
                        });
                    }
                }
                if (module.transcript) {
                    const relevance = calculateRelevance(module.transcript, queryTerms);
                    if (relevance > 0) {
                        chunks.push({
                            text: `Lesson Transcript - ${module.title}:\n${module.transcript}`,
                            relevance
                        });
                    }
                }
            }
        }
    }

    // Sort by relevance and return top chunks
    return chunks
        .sort((a, b) => b.relevance - a.relevance)
        .slice(0, maxChunks)
        .map(c => c.text);
}

function calculateRelevance(text: string, queryTerms: string[]): number {
    const lowerText = text.toLowerCase();
    let score = 0;

    for (const term of queryTerms) {
        const matches = (lowerText.match(new RegExp(term, 'g')) || []).length;
        score += matches;
    }

    return score;
}
