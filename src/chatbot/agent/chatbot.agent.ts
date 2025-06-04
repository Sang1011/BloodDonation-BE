import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class ChatbotAgent {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async handleMessage(message: string): Promise<string> {
    const prompt = `
Bạn là một trợ lý AI hỗ trợ hiến máu cho cơ sở y tế. Bạn có thể giúp:
- Giải thích về nhóm máu và truyền máu phù hợp.
- Hướng dẫn người dùng đăng ký hiến máu.
- Giải thích về phục hồi sau khi hiến máu.
- Giúp người cần máu tìm nhóm máu phù hợp.
- Trả lời về lịch sử hiến máu, địa điểm, và quy trình.

Câu hỏi từ người dùng: "${message}"
Hãy trả lời một cách thân thiện, chính xác và rõ ràng.
`;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'Bạn là trợ lý AI hỗ trợ hiến máu cho cơ sở y tế.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return response.choices[0].message.content || 'Tôi chưa có thông tin cụ thể để trả lời câu hỏi này.';
  }
}
