export function getTypeLabel(type: string): string {
    switch (type) {
        case "hien": return "Đăng ký hiến máu";
        case "can": return "Đăng ký cần máu";
        case "cangap": return "Cần máu khẩn cấp"
        case "lichsu": return "Đã hiến và cần máu";
        default: return "Không rõ";
    }
}