export interface Hook {
  id: string;
  text: string;
  formula: string;
  platform: string;
  score: number;
}

export interface Session {
  id: string;
  topic: string;
  platforms: string[];
  tone: string;
  niche: string;
  hooks: Hook[];
  date: string;
  dateLabel: string;
}

export interface CreditsState {
  count: number;
  resetAt: string;
}

export interface GenerateRequest {
  topic: string;
  platforms: string[];
  tone: string;
  niche: string;
}