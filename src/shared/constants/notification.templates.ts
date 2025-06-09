const notificationTemplates = {
  bloodDonationRegistration: (userName: string) => ({
    title: "🩸 Đăng ký hiến máu thành công!",
    message: `Chào ${userName}, bạn đã đăng ký hiến máu thành công! Cảm ơn bạn đã góp phần cứu người.`,
    type: 'bloodDonationRegistration',
  }),
  bloodTransfusionRegistration: (userName: string) => ({
    title: "💉 Đăng ký xin truyền máu thành công!",
    message: `Chào ${userName}, bạn đã đăng ký xin truyền máu thành công! Vui lòng theo dõi lịch hẹn.`,
    type: 'bloodTransfusionRegistration',
  }),
  bloodDonationReminder: (nextDate: string) => ({
    title: "🩸 Nhắc nhở hiến máu",
    message: `Bạn có lịch hiến máu vào ngày ${nextDate}. Đừng quên nhé!`,
    type: 'reminder',
  }),
  healthCheckReminder: () => ({
    title: "🔔 Nhắc nhở kiểm tra sức khỏe",
    message: "Đã đến ngày kiểm tra sức khỏe rồi nhé!",
    type: 'reminder',
  }),
};
