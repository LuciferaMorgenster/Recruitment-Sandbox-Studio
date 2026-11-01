import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// Server-side GoogleGenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper to execute generation with graceful fallback for models
async function executeGenAI(
  preferredModel: string,
  generateFn: (modelName: string) => Promise<any>
) {
  try {
    return await generateFn(preferredModel);
  } catch (error: any) {
    console.warn(`Error running model ${preferredModel}:`, error?.message || error);
    // If argon or a specialized model fails due to quota or permissions, fallback to gemini-3.8-flash
    if (preferredModel !== 'gemini-3.8-flash') {
      console.log('Falling back to gemini-3.8-flash...');
      return await generateFn('gemini-3.8-flash');
    }
    throw error;
  }
}

// 1. Generate Recruitment Sandbox Outputs (LinkedIn JD + 10-Question Interview Guide)
app.post('/api/generate-recruitment', async (req: Request, res: Response) => {
  try {
    const {
      rawNotes,
      roleTitle = '',
      seniority = 'Senior',
      workplaceType = 'Hybrid',
      tone = 'Bold & High Growth',
      companyInfo = '',
      compensation = '',
      model = 'gemini-3.8-flash',
      enableHighThinking = false,
    } = req.body;

    if (!rawNotes || typeof rawNotes !== 'string' || !rawNotes.trim()) {
      return res.status(400).json({ error: 'Raw notes are required to generate recruitment assets.' });
    }

    const selectedModel = enableHighThinking || model === 'gemini-4-argon' ? 'gemini-4-argon' : model;

    const systemInstruction = `You are an elite Talent Acquisition Director and Principal Hiring Architect at top-tier tech companies.
Your job is to take raw, messy, unstructured hiring manager notes and convert them into two pristine, production-grade assets:
1. A world-class LinkedIn Job Description formatted specifically for high reader engagement and conversion on LinkedIn (compelling hook, clean scannable spacing, clear responsibilities, distinct hard vs soft skills, perks, hashtags).
2. A rigorous, exhaustive 10-question Behavioral Interview Guide specifically targeting the 5 hard skills and 5 soft skills extracted directly from the generated JD.

For every behavioral question, provide:
- Target skill/competency name
- Type ('hard' or 'soft')
- STAR method behavioral question ("Tell me about a time when...")
- Why it matters for this specific role
- Green flags (what great answers contain)
- Red flags (concerning signs/disqualifiers)
- 2-3 follow-up probing questions to drill deeper
- 1-to-5 scoring rubric with concrete observable behavioral criteria for 1 (Below Expectations), 3 (Meets Expectations), and 5 (Exceeds Expectations).

Ensure all 10 questions are distinct, realistic, high-signal, and non-generic.
Return the result strictly as a valid JSON object matching the requested schema.`;

    const prompt = `Here are the raw notes and parameters for the role:
Role Title (suggested/provisional): ${roleTitle || 'Infer from notes'}
Seniority Level: ${seniority}
Workplace Model: ${workplaceType}
Desired Tone: ${tone}
Company / Team Context: ${companyInfo || 'High growth technology team'}
Compensation / Perks notes: ${compensation || 'Competitive package with equity'}

RAW HIRING MANAGER NOTES:
"""
${rawNotes}
"""

Please synthesize this into a structured JSON recruitment package with:
1. Role Summary details
2. Full LinkedIn Job Description (both sectioned and as a single 'fullFormattedLinkedInPost' ready to copy into LinkedIn with emojis and formatting)
3. Exactly 10 targeted behavioral interview questions (5 hard skills, 5 soft skills) with complete evaluation rubrics and probing follow-ups.`;

    const response = await executeGenAI(selectedModel, async (modelToUse) => {
      const config: any = {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            roleSummary: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                seniority: { type: Type.STRING },
                department: { type: Type.STRING },
                workplaceType: { type: Type.STRING },
                oneLinePitch: { type: Type.STRING },
                keyHardSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                keySoftSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['title', 'seniority', 'department', 'workplaceType', 'oneLinePitch', 'keyHardSkills', 'keySoftSkills'],
            },
            jobDescription: {
              type: Type.OBJECT,
              properties: {
                headline: { type: Type.STRING },
                hook: { type: Type.STRING },
                aboutCompanyAndTeam: { type: Type.STRING },
                roleMission: { type: Type.STRING },
                keyResponsibilities: { type: Type.ARRAY, items: { type: Type.STRING } },
                hardSkillsRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                softSkillsRequirements: { type: Type.ARRAY, items: { type: Type.STRING } },
                niceToHaves: { type: Type.ARRAY, items: { type: Type.STRING } },
                perksAndBenefits: { type: Type.ARRAY, items: { type: Type.STRING } },
                compensationRange: { type: Type.STRING },
                callToAction: { type: Type.STRING },
                linkedInHashtags: { type: Type.ARRAY, items: { type: Type.STRING } },
                fullFormattedLinkedInPost: { type: Type.STRING },
              },
              required: [
                'headline',
                'hook',
                'aboutCompanyAndTeam',
                'roleMission',
                'keyResponsibilities',
                'hardSkillsRequirements',
                'softSkillsRequirements',
                'niceToHaves',
                'perksAndBenefits',
                'fullFormattedLinkedInPost',
              ],
            },
            interviewGuide: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  skillName: { type: Type.STRING },
                  skillType: { type: Type.STRING }, // 'hard' | 'soft'
                  question: { type: Type.STRING },
                  rationale: { type: Type.STRING },
                  greenFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  redFlags: { type: Type.ARRAY, items: { type: Type.STRING } },
                  followUpProbes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  rubric: {
                    type: Type.OBJECT,
                    properties: {
                      score1: { type: Type.STRING },
                      score3: { type: Type.STRING },
                      score5: { type: Type.STRING },
                    },
                    required: ['score1', 'score3', 'score5'],
                  },
                },
                required: ['id', 'skillName', 'skillType', 'question', 'rationale', 'greenFlags', 'redFlags', 'followUpProbes', 'rubric'],
              },
            },
          },
          required: ['roleSummary', 'jobDescription', 'interviewGuide'],
        },
      };

      if (enableHighThinking || modelToUse === 'gemini-4-argon') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      return await ai.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config,
      });
    });

    const parsedData = JSON.parse(response.text || '{}');
    return res.json({
      success: true,
      data: parsedData,
      modelUsed: selectedModel,
    });
  } catch (err: any) {
    console.error('Recruitment generation error:', err);
    return res.status(500).json({
      error: err?.message || 'Failed to generate recruitment assets. Please try again.',
    });
  }
});

// 2. Multi-turn Recruitment Copilot Chat
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      messages = [],
      systemInstruction = '',
      model = 'gemini-3.8-flash',
      enableHighThinking = false,
      context = {},
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const selectedModel = enableHighThinking || model === 'gemini-4-argon' ? 'gemini-4-argon' : model;

    const baseSystemInstruction = systemInstruction || `You are an expert Recruitment Copilot, Talent Partner, and Interview Coach.
You assist hiring managers and recruiters in refining Job Descriptions, drafting candidate outreach (InMail, emails), simulating behavioral interview candidate answers, scoring candidate answers against interview guides, and optimizing talent acquisition strategy.
Provide concise, actionable, and structured insights.`;

    // Inject context if available
    let enrichedSystemInstruction = baseSystemInstruction;
    if (context?.jobDescription || context?.interviewGuide) {
      enrichedSystemInstruction += `\n\nCURRENT RECRUITMENT CONTEXT:
Job Title: ${context.jobDescription?.headline || context.roleSummary?.title || 'Unknown'}
Overview: ${context.jobDescription?.roleMission || ''}
Interview Competencies: ${
        context.interviewGuide?.map((q: any) => `${q.id}. [${q.skillType}] ${q.skillName}`).join(', ') || 'N/A'
      }`;
    }

    // Format contents into gemini multi-turn format
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await executeGenAI(selectedModel, async (modelToUse) => {
      const config: any = {
        systemInstruction: enrichedSystemInstruction,
      };

      if (enableHighThinking || modelToUse === 'gemini-4-argon') {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      }

      return await ai.models.generateContent({
        model: modelToUse,
        contents,
        config,
      });
    });

    return res.json({
      success: true,
      reply: response.text || '',
      modelUsed: selectedModel,
    });
  } catch (err: any) {
    console.error('Chat error:', err);
    return res.status(500).json({
      error: err?.message || 'Chat generation failed. Please check connection and try again.',
    });
  }
});

// 3. Candidate Answer Evaluation against Rubric
app.post('/api/evaluate-answer', async (req: Request, res: Response) => {
  try {
    const { question, candidateAnswer, rubric, skillName } = req.body;
    if (!candidateAnswer || !question) {
      return res.status(400).json({ error: 'Candidate answer and question are required.' });
    }

    const prompt = `You are an expert hiring interviewer. Evaluate the following candidate answer to a behavioral question:
Competency: ${skillName}
Question: "${question}"
Candidate's Answer:
"""${candidateAnswer}"""

Scoring Rubric:
- 1 (Below Expectations): ${rubric?.score1 || 'Lacks depth, accountability, or evidence'}
- 3 (Meets Expectations): ${rubric?.score3 || 'Clear STAR response, satisfactory outcome'}
- 5 (Exceeds Expectations): ${rubric?.score5 || 'Mastery, measurable impact, deep reflection'}

Provide a structured evaluation in JSON with:
- score: integer from 1 to 5
- starBreakdown: { situation: string, task: string, action: string, result: string }
- strengths: string[]
- areasForImprovement: string[]
- suggestedFollowUp: string
- hiringRecommendation: string ('Strong Yes', 'Yes', 'Neutral', 'No')`;

    const response = await executeGenAI('gemini-3.8-flash', async (modelToUse) => {
      return await ai.models.generateContent({
        model: modelToUse,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER },
              hiringRecommendation: { type: Type.STRING },
              starBreakdown: {
                type: Type.OBJECT,
                properties: {
                  situation: { type: Type.STRING },
                  task: { type: Type.STRING },
                  action: { type: Type.STRING },
                  result: { type: Type.STRING },
                },
                required: ['situation', 'task', 'action', 'result'],
              },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              areasForImprovement: { type: Type.ARRAY, items: { type: Type.STRING } },
              suggestedFollowUp: { type: Type.STRING },
              summaryFeedback: { type: Type.STRING },
            },
            required: ['score', 'hiringRecommendation', 'starBreakdown', 'strengths', 'areasForImprovement', 'suggestedFollowUp'],
          },
        },
      });
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, evaluation: parsed });
  } catch (err: any) {
    console.error('Evaluation error:', err);
    return res.status(500).json({ error: err?.message || 'Failed to evaluate answer.' });
  }
});

// Vite middleware for development, static serve for production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Recruitment Sandbox server listening on port ${port} in ${isProd ? 'production' : 'development'} mode.`);
  });
}

startServer();
