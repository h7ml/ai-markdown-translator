export interface DirectoryStats {
  dirs: number;
  files: number;
}

export interface ChatData {
  model: string;
  messages: { role: 'developer' | 'user' | 'assistant'; content: string }[];
}

export type ApiType = 'completions' | 'responses'; // add 'assistants' later
