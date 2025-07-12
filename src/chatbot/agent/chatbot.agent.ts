import { Injectable } from '@nestjs/common';
import { CentralBloodService } from 'src/central_bloods/central_blood.service';
import { InforHealthService } from 'src/InforHealths/infor-healths.service';
import { LocationService } from 'src/locations/location.service';
import { SearchService } from 'src/search/search.service';
import { getWeekdayFromDateString } from 'src/shared/utils/getWeekDayFromDateString';
import { parseWeekday } from 'src/shared/utils/parseWeekDay';
import { removeVietnameseTones } from 'src/shared/utils/removeVNTones';
import { UsersService } from 'src/users/users.service';
import { WorkingHoursService } from 'src/working_hours/working_hours.service';

@Injectable()
export class ChatbotAgent {
  private readonly openRouterAI: string;

  constructor(
    private readonly inforHealthService: InforHealthService,
    private readonly userService: UsersService,
    private readonly searchService: SearchService,
    private readonly centralBloodService: CentralBloodService,
    private readonly locationService: LocationService
  ) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OpenRouter API key');
    }
    this.openRouterAI = apiKey;
  }

  private async handleUserProfile(userId: string): Promise<string> {
    const user = await this.userService.findOne(userId);
    const { fullname, gender, dob, phone, email } = user;
    let address = 'Chưa cập nhật';

    if (typeof user.location_id === 'string') {
      const location = await this.locationService.findById(user.location_id);
      address = location?.full_address ?? 'Chưa cập nhật';
    } else if (typeof user.location_id === 'object' && user.location_id !== null) {
      address = (user.location_id as { full_address?: string }).full_address ?? 'Chưa cập nhật';
    }

    const dateOfBirth = dob
      ? new Date(dob).toLocaleDateString('vi-VN')
      : 'Chưa cập nhật';

    let response = `📌 Thông tin hồ sơ của bạn:\n`;
    response += `👤 Họ tên: ${fullname}\n`;
    response += `👫 Giới tính: ${gender || 'Chưa cập nhật'}\n`;
    response += `🎂 Ngày sinh: ${dateOfBirth}\n`;
    response += `📞 Số điện thoại: ${phone || 'Chưa cập nhật'}\n`;
    response += `📧 Email: ${email}\n`;
    response += `🏠 Địa chỉ: ${address}\n`;
    return response;
  }

  private async handleInforHealth(userId: string): Promise<string> {
    const infor = await this.inforHealthService.findOneByUserId(userId);
    if (!infor) {
      return "Bạn chưa khai báo thông tin sức khỏe. Vui lòng cập nhật để tiếp tục.";
    }

    const height = infor.height ? `${infor.height} cm` : 'Chưa cập nhật';
    const weight = infor.weight_decimal ? `${infor.weight_decimal} kg` : 'Chưa cập nhật';
    const pressure = infor.blood_pressure ? `${infor.blood_pressure} mmHg` : 'Chưa cập nhật';
    const history = infor.medical_history || 'Không có';
    const status = infor.status_health || 'Chưa xác định';
    const latest = infor.latest_donate ? new Date(infor.latest_donate).toLocaleDateString('vi-VN') : 'Chưa có';

    let response = `📋 Tình trạng sức khỏe bạn đã khai báo:\n`;
    response += `• Chiều cao: ${height}\n`;
    response += `• Cân nặng: ${weight}\n`;
    response += `• Huyết áp: ${pressure}\n`;
    response += `• Tiền sử bệnh: ${history}\n`;
    response += `• Tình trạng hiện tại: ${status}\n`;
    response += `• Lần hiến máu gần nhất: ${latest}\n`;

    return response;
  }

  private async handleCenterTotal(): Promise<string> {
    const centers = await this.centralBloodService.findAll(1, 9999, "");
    const list = centers.result;
    if (!list.length) return "Hiện tại chưa có trung tâm hiến máu nào.";
    let response = `Hiện có tổng cộng ${list.length} trung tâm hiến máu:\n\n`;
    for (const [index, center] of list.entries()) {
      response += `${index + 1}. ${center.centralBlood_name} - ${center.centralBlood_address}\n`;
      if (center.working_id?.length) {
        const workingList = center.working_id as any[];
        for (const w of workingList) {
          const day = w.day_of_week;
          const open = new Date(w.open_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          const close = new Date(w.close_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          const openText = w.is_open ? 'Đang mở cửa' : 'Đóng cửa';
          response += `   • ${day}: ${open} - ${close} (${openText})\n`;
        }
      } else {
        response += `   • Không có thông tin giờ làm việc\n`;
      }
      response += '\n';
    }
    return response;
  }

  private async handleCenterNearest(user_id: string, radiusInKm: number = 5): Promise<string> {
    const listCenterNearest = await this.searchService.searchCenterNearestFromUserAddress(user_id, radiusInKm);
    if (!listCenterNearest.length) return `Hiện tại không có trung tâm nào gần địa chỉ bạn đã đăng ký trong bán kính ${radiusInKm}km, bạn muốn tìm với bán kính khác?`;

    let response = `Trong bán kính ${radiusInKm}km, hiện có ${listCenterNearest.length} trung tâm gần địa chỉ bạn đã đăng ký:\n\n`;
    const centers = await this.centralBloodService.findAll(1, 9999, "");
    const list = centers.result;
    const nearestNames = listCenterNearest.map((c) => c.centralBlood_name);
    const filteredCenters = list.filter((center) => nearestNames.includes(center.centralBlood_name));

    for (const [index, center] of filteredCenters.entries()) {
      response += `${index + 1}. ${center.centralBlood_name} - ${center.centralBlood_address}\n`;
      if (center.working_id?.length) {
        const workingList = center.working_id as any[];
        for (const w of workingList) {
          const day = w.day_of_week;
          const open = new Date(w.open_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          const close = new Date(w.close_time).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
          const openText = w.is_open ? 'Mở cửa' : 'Đóng cửa';
          response += `   • ${day}: ${open} - ${close} (${openText})\n`;
        }
      } else {
        response += `   • Không có thông tin giờ làm việc\n`;
      }
      response += '\n';
    }
    return response;
  }

  private async handleCenterOpenAt(user_id: string, radiusInKm: number = 5, day: string, hour: number | null): Promise<string> {
    const nearbyCenters = await this.searchService.searchCenterNearestFromUserAddress(user_id, radiusInKm);
    if (!nearbyCenters.length) return 'Không có trung tâm nào gần bạn.';

    const centers = await this.centralBloodService.findAll(1, 9999, '');
    const nearestNames = nearbyCenters.map(c => c.centralBlood_name);
    const filtered = centers.result.filter(c => nearestNames.includes(c.centralBlood_name));

    let response = `Những trung tâm gần bạn mở cửa vào ${day}${hour !== null ? ` lúc ${hour} giờ bao gồm:` : ''}:\n\n`;
    let found = false;

    for (const center of filtered) {
      const workingList = center.working_id as any[];
      const match = workingList?.find(w => {
        const isSameDay = w.day_of_week.toLowerCase() === day.toLowerCase();
        if (!isSameDay || !w.is_open) return false;

        if (hour === null) return true;
        const openH = new Date(w.open_time).getHours();
        const closeH = new Date(w.close_time).getHours();
        return hour >= openH && hour < closeH;
      });

      if (match) {
        found = true;
        response += `• ${center.centralBlood_name} - ${center.centralBlood_address}\n`;
      }
    }

    if (!found) return `Không có trung tâm nào gần bạn mở cửa vào ${day}${hour !== null ? ` lúc ${hour} giờ` : ''}.`;
    return response;
  }



  async handleMessage(user_id: string, message: string): Promise<string> {
    const lowerMsg = removeVietnameseTones(message);

    const mustInclude = ['trung tam', 'central', 'center', 'noi hien mau', 'dia diem hien mau', 'noi nhan mau', 'dia diem nhan mau'];
    const totalKeywords = ['tat ca', 'bao nhieu', 'danh sach', 'co nhung', 'toan bo'];
    const nearbyKeywords = ['gan nhat', 'gan day', 'gan toi', 'quanh day', 'ban kinh', 'xung quanh'];
    const userKeywords = ['thong tin ca nhan', 'profile', 'ho so', 'thong tin da dang ky', 'thong tin ma toi da dang ky'];
    const scheduleKeywords = ['mo cua', 'dong cua', 'gio lam', 'lich lam', 'lam viec', 'trung tam'];
    const healthKeywords = ['suc khoe', 'tinh trang', 'trang thai suc khoe', 'chieu cao', 'can nang', 'benh', 'lich su hien mau'];

    const hourMatch = lowerMsg.match(/(\d{1,2})\s*(h|gio|giờ)/);
    let hour: number | null = hourMatch ? parseInt(hourMatch[1]) : null;

    const weekdayMatch = lowerMsg.match(/thu\s*(\d|hai|ba|tu|nam|sau|bay|bảy|cn|chu nhat)/);
    const weekdayFromThu = weekdayMatch ? parseWeekday(weekdayMatch[1]) : null;
    const weekdayFromNgay = getWeekdayFromDateString(lowerMsg);
    const weekday = weekdayFromThu || weekdayFromNgay;

    if (hour === null) {
      if (lowerMsg.includes('sang')) hour = 8;
      else if (lowerMsg.includes('trua')) hour = 12;
      else if (lowerMsg.includes('chieu')) hour = 16;
      else if (lowerMsg.includes('toi')) hour = 19;
    }

    else if (lowerMsg.includes('toi') && hour < 12) {
      hour += 12;
    }
    const isHealthQuery = healthKeywords.some((k) => lowerMsg.includes(k));

    const isScheduleQuery =
      mustInclude.some(k => lowerMsg.includes(k)) &&
      scheduleKeywords.some(k => lowerMsg.includes(k)) &&
      (weekday !== null);

    const isUserQuery = userKeywords.some((k) => lowerMsg.includes(k));

    const isContainMustInclude = mustInclude.some((k) => lowerMsg.includes(k));

    const isTrungTamQuery =
      isContainMustInclude && totalKeywords.some((k) => lowerMsg.includes(k));

    const isNearbyQuery =
      isContainMustInclude && nearbyKeywords.some((k) => lowerMsg.includes(k));

    const radiusMatch = lowerMsg.match(/(\d+)\s*(km|kilomet|ki-lo-met)?/);
    const radiusInKm = radiusMatch ? parseInt(radiusMatch[1]) : 5;

    if (isUserQuery) {
      return await this.handleUserProfile(user_id);
    }

    if (isHealthQuery) {
      return await this.handleInforHealth(user_id);
    }

    if (isScheduleQuery) {
      return await this.handleCenterOpenAt(user_id, radiusInKm, weekday!, hour);
    }

    if (isNearbyQuery) {
      return await this.handleCenterNearest(user_id, radiusInKm);
    }

    if (isTrungTamQuery) {
      return await this.handleCenterTotal();
    }

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
      model: 'meta-llama/llama-3-8b-instruct',
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
} 1