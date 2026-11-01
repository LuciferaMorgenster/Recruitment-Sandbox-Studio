export interface RoleSummary {
  title: string;
  seniority: string;
  department: string;
  workplaceType: string;
  oneLinePitch: string;
  keyHardSkills: string[];
  keySoftSkills: string[];
}

export interface JobDescription {
  headline: string;
  hook: string;
  aboutCompanyAndTeam: string;
  roleMission: string;
  keyResponsibilities: string[];
  hardSkillsRequirements: string[];
  softSkillsRequirements: string[];
  niceToHaves: string[];
  perksAndBenefits: string[];
  compensationRange?: string;
  callToAction: string;
  linkedInHashtags: string[];
  fullFormattedLinkedInPost: string;
}

export interface Rubric {
  score1: string; // Below Expectations
  score3: string; // Meets Expectations
  score5: string; // Exceeds Expectations
}

export interface InterviewQuestion {
  id: number;
  skillName: string;
  skillType: 'hard' | 'soft' | string;
  question: string;
  rationale: string;
  greenFlags: string[];
  redFlags: string[];
  followUpProbes: string[];
  rubric: Rubric;
}

export interface RecruitmentData {
  roleSummary: RoleSummary;
  jobDescription: JobDescription;
  interviewGuide: InterviewQuestion[];
}

export interface CandidateRating {
  score: number; // 0 to 5 (0 means unrated)
  notes: string;
  checkedGreenFlags: number[];
  checkedRedFlags: number[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
  isHighThinking?: boolean;
}

export type BotRole = 'recruiter_copilot' | 'candidate_simulator' | 'rubric_evaluator';

export interface RolePreset {
  id: string;
  label: string;
  title: string;
  seniority: string;
  workplaceType: string;
  tone: string;
  notes: string;
}
