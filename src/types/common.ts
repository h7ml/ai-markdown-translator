export interface DirectoryStats {
  dirs: number;
  files: number;
}

export interface ChatData {
  model: string;
  messages: { role: 'system' | 'user' | 'assistant' | 'developer'; content: string }[];
}
// [CN] 关于'developer'角色的详细信息，请参考：https://platform.openai.com/docs/guides/responses-vs-chat-completions
// OpenAI建议使用'developer'角色代替'system'，但为了与当前LLM标准保持兼容性，我们继续使用'system'。
// 为了未来的兼容性，我们也包含了'developer'角色。
//
// [EN] For information about the 'developer' role, please refer to: https://platform.openai.com/docs/guides/responses-vs-chat-completions
// OpenAI recommends using the 'developer' role instead of 'system', but we maintain 'system' for compatibility with current LLM standards.
// Also the 'developer' role is included for future compatibility.
//
// [KO] 'developer' 역할에 대한 자세한 내용은 다음 링크를 참조하세요: https://platform.openai.com/docs/guides/responses-vs-chat-completions
// OpenAI는 'system' 대신 'developer' 역할 사용을 권장하지만, 현재 LLM 표준과의 호환성을 위해 'system'을 유지합니다.
// 향후 호환성을 위해 'developer' 역할도 포함했습니다.

export type ApiType = 'completions' | 'responses' | 'ollama'; // add 'assistants' later
