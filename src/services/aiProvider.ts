// AI Provider Service - Abstracted for easy switching between providers
// Currently supports: MiniMax, DeepSeek (future)

export type AIProvider = 'minimax' | 'deepseek';

export interface AIConfig {
  provider: AIProvider;
  maxTokens: number;
  temperature: number;
}

export interface AICompletionRequest {
  prompt: string;
  maxTokens?: number;
}

export interface AICompletionResponse {
  success: boolean;
  content: string;
  tokensUsed?: number;
  error?: string;
}

// Default configuration - optimized for low credit usage
const defaultConfig: AIConfig = {
  provider: 'minimax',
  maxTokens: 200, // Keep responses concise
  temperature: 0.7
};

let currentConfig = { ...defaultConfig };

// Set AI provider configuration
export function setAIConfig(config: Partial<AIConfig>): void {
  currentConfig = { ...currentConfig, ...config };
}

// Get current AI configuration
export function getAIConfig(): AIConfig {
  return { ...currentConfig };
}

// Generate AI completion - provider-agnostic interface
export async function generateCompletion(request: AICompletionRequest): Promise<AICompletionResponse> {
  const maxTokens = request.maxTokens || currentConfig.maxTokens;

  try {
    // In production, this would call the actual API
    // For now, simulate the AI improvement locally
    const improvedMessage = simulateAIImprovement(request.prompt);

    return {
      success: true,
      content: improvedMessage,
      tokensUsed: Math.floor(improvedMessage.length / 4) // Approximate
    };
  } catch (error) {
    return {
      success: false,
      content: '',
      error: error instanceof Error ? error.message : 'AI generation failed'
    };
  }
}

// Simulate AI improvement for demo (replace with actual API call in production)
function simulateAIImprovement(originalPrompt: string): string {
  // Extract data from the prompt
  const lines = originalPrompt.split('\n');
  let clientName = '';
  let clientCompany = '';
  let country = '';
  let message = '';

  lines.forEach(line => {
    if (line.startsWith('Client:')) clientName = line.replace('Client:', '').trim();
    if (line.startsWith('Company:')) clientCompany = line.replace('Company:', '').trim();
    if (line.startsWith('Country:')) country = line.replace('Country:', '').trim();
    if (line.startsWith('Message:')) message = line.replace('Message:', '').trim();
  });

  // Generate improved professional message
  return `Dear Export Team,

I hope this message finds you well. My name is ${clientName} from ${clientCompany}, based in ${country}.

${message}

We are keen to explore potential business opportunities and would appreciate receiving your product catalog, pricing information, and available terms for international orders.

I look forward to your favorable response.

Best regards,
${clientName}
${clientCompany}`;
}

// Specific function for improving export inquiries
export async function improveExportInquiry(data: {
  clientName: string;
  clientCompany: string;
  country: string;
  originalMessage: string;
}): Promise<AICompletionResponse> {
  // Build minimal prompt for low credit usage
  const prompt = `Rewrite this into a short professional international export inquiry email. Keep it concise and formal.

Client: ${data.clientName}
Company: ${data.clientCompany}
Country: ${data.country}
Message: ${data.originalMessage}`;

  return generateCompletion({
    prompt,
    maxTokens: 200 // Keep response concise
  });
}
