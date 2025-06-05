import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatbotAgent {
  private readonly openRouterAI: string;

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OpenRouter API key');
    }
    this.openRouterAI = apiKey;
  }

  async handleMessage(message: string): Promise<string> {
    const systemPrompt = `
Bạn là một trợ lý AI hỗ trợ hiến máu cho cơ sở y tế. Bạn có thể giúp:
- Giải thích về nhóm máu và truyền máu phù hợp.
- Hướng dẫn người dùng đăng ký hiến máu.
- Giải thích về phục hồi sau khi hiến máu.
- Giúp người cần máu tìm nhóm máu phù hợp.
- Trả lời về lịch sử hiến máu, địa điểm, và quy trình.

Hãy luôn trả lời bằng **tiếng Việt** một cách rõ ràng, thân thiện và dễ hiểu cho người dùng.
Luôn nói chuyện thân thiện, ngắn gọn, rõ ràng như đang tư vấn trực tiếp với người dân Việt Nam.
`.trim();

    const requestBody = {
      model: 'meta-llama/llama-3-8b-instruct', // Hoặc 'openrouter/mistralai/mistral-7b-instruct' nếu cần siêu nhẹ
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    };

    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.openRouterAI}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error('OpenRouter API error:', errText);
        throw new Error(`API call failed: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content ?? 'Xin lỗi, tôi chưa thể trả lời câu hỏi này.';
    } catch (err: any) {
      console.error('Lỗi chatbot:', err.message);
      return 'Xin lỗi, hiện tại tôi không thể xử lý câu hỏi. Vui lòng thử lại sau.';
    }
  }
}
