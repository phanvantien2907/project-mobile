import { ArrowRight, Building2, ChartColumnBig, ClipboardList, GraduationCap, ReceiptText, School } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

const shortcuts = [
  {
    title: "Quản lý sinh viên",
    desc: "Hồ sơ, tài khoản & thông tin cá nhân",
    icon: GraduationCap,
  },
  {
    title: "Phòng ban",
    desc: "Cơ cấu tổ chức & nhân sự phòng ban",
    icon: Building2,
  },
  {
    title: "Lớp học",
    desc: "Danh sách lớp, sĩ số & lịch học",
    icon: School,
  },
  {
    title: "Quản lý điểm",
    desc: "Nhập điểm, bảng điểm & thống kê",
    icon: ClipboardList,
  },
  {
    title: "Báo cáo tổng hợp",
    desc: "Thống kê, biểu đồ & xuất dữ liệu",
    icon: ChartColumnBig,
  },
  {
    title: "Nhật ký hệ thống",
    desc: "Lịch sử thao tác & thay đổi",
    icon: ReceiptText,
  },
];

export default function FastManageComponent() {
    return (
         <View className="mb-5 rounded-3xl bg-white p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <Text className="text-lg font-bold text-brand-900">
              Quản trị nhanh
            </Text>
            <Pressable>
              <Text className="text-sm font-semibold text-brand-500">
                Xem tất cả
              </Text>
            </Pressable>
          </View>

          <View className="gap-3">
            {shortcuts.map((item) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.title}
                  className="flex-row items-center gap-3.5 rounded-2xl bg-brand-50 p-3.5 active:opacity-80"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-brand-500">
                    <Icon color="#FFFFFF" size={18} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-brand-900">
                      {item.title}
                    </Text>
                    <Text className="text-xs leading-4 text-brand-800/60">
                      {item.desc}
                    </Text>
                  </View>
                  <ArrowRight color="#C9A387" size={16} />
                </Pressable>
              );
            })}
          </View>
        </View>
    )
}