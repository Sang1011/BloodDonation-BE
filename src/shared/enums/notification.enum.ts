export enum NotificationType {
  SYSTEM = 'SYSTEM',
  BOOKING_DONATE_SUCCESS = 'BOOKING_DONATE_SUCCESS',
  BOOKING_RECEIVE_SUCCESS = "BOOKING_RECEIVE_SUCCESS",
  CANCELLED_DONATE_SCHEDULE = "CANCELLED_DONATE_SCHEDULE",
  CANCELLED_RECEIVE_SCHEDULE = "CANCELLED_RECEIVE_SCHEDULE",
}

export const NotificationTemplates: Partial<Record<NotificationType, { title: string; message: string, type: string }>> = {
  [NotificationType.BOOKING_DONATE_SUCCESS]: {
    title: 'Đặt lịch thành công',
    message: 'Cảm ơn bạn đã đặt lịch hiến máu. Hãy theo dõi lịch để biết thêm chi tiết',
    type: "BOOKING_DONATE_SUCCESS",
  },
  [NotificationType.BOOKING_RECEIVE_SUCCESS]: {
    title: 'Đặt lịch thành công',
    message: 'Bạn đã đặt lịch nhận máu. Hãy theo dõi lịch để biết thêm chi tiết',
    type: "BOOKING_RECEIVE_SUCCESS"
  },
  [NotificationType.CANCELLED_DONATE_SCHEDULE]: {
    title: 'Hủy lịch hiến máu',
    message: 'Lịch hiến máu của bạn đã bị hủy. Nếu cần, vui lòng đặt lịch lại.',
    type: "CANCELLED_DONATE_SCHEDULE"
  },
  [NotificationType.CANCELLED_RECEIVE_SCHEDULE]: {
    title: 'Hủy lịch nhận máu',
    message: 'Lịch nhận máu của bạn đã bị hủy. Vui lòng kiểm tra lại thông tin hoặc đặt lại lịch nếu cần.',
    type: "CANCELLED_RECEIVE_SCHEDULE"
  },
};