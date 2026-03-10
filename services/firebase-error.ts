import Toast from "react-native-toast-message";

const AUTH_ERROR_MAP: Record<string, string> = {
  // Login
  "auth/wrong-password": "Sai mật khẩu!",
  "auth/user-not-found": "Tài khoản không tồn tại!",
  "auth/invalid-credential": "Email hoặc mật khẩu không đúng!",
  "auth/user-disabled": "Tài khoản đã bị vô hiệu hóa!",
  "auth/too-many-requests": "Quá nhiều lần thử, vui lòng thử lại sau!",

  // Register
  "auth/email-already-in-use": "Email đã được sử dụng!",
  "auth/weak-password": "Mật khẩu quá yếu (tối thiểu 6 ký tự)!",

  // Common
  "auth/invalid-email": "Email không hợp lệ!",
  "auth/network-request-failed": "Lỗi kết nối mạng, vui lòng thử lại!",
  "auth/internal-error": "Lỗi hệ thống, vui lòng thử lại sau!",
  "auth/operation-not-allowed": "Chức năng này chưa được kích hoạt!",
};

function extractErrorCode(err: unknown): string {
  if (typeof err === "object" && err !== null && "code" in err) {
    return String((err as { code?: string }).code ?? "");
  }
  if (err instanceof Error) {
    for (const code of Object.keys(AUTH_ERROR_MAP)) {
      if (err.message.includes(code)) return code;
    }
  }
  return "";
}

export function handleAuthError(err: unknown, fallbackMessage: string) {
  const code = extractErrorCode(err);
  const message = AUTH_ERROR_MAP[code] ?? fallbackMessage;
  Toast.show({ type: "error", text1: message });
}
