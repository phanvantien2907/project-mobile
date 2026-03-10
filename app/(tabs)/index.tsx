import {
  ArrowRight,
  BookOpen,
  Building2,
  ChartColumnBig,
  ClipboardList,
  Clock,
  GraduationCap,
  ReceiptText,
  School,
  TrendingUp,
  Users,
} from "lucide-react-native";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

const quickStats = [
  {
    label: "Sinh viên",
    value: "1,286",
    change: "+12%",
    icon: GraduationCap,
    bg: "bg-brand-50",
    iconBg: "bg-brand-500",
  },
  {
    label: "Lớp học",
    value: "48",
    change: "+3",
    icon: School,
    bg: "bg-[#FFF0E1]",
    iconBg: "bg-brand-400",
  },
  {
    label: "Phòng ban",
    value: "12",
    change: "Ổn định",
    icon: Building2,
    bg: "bg-[#FFE7D1]",
    iconBg: "bg-brand-600",
  },
  {
    label: "Điểm TB",
    value: "7.4",
    change: "+0.3",
    icon: TrendingUp,
    bg: "bg-brand-100",
    iconBg: "bg-brand-500",
  },
];

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

const recentActivities = [
  { text: "Thêm 15 sinh viên mới vào lớp CNTT-K20", time: "10 phút trước" },
  { text: "Cập nhật điểm môn Toán - Lớp KT-K19", time: "32 phút trước" },
  { text: "Phòng Đào tạo thêm 2 môn học mới", time: "1 giờ trước" },
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-brand-50">
      <ScrollView
        className="flex-1"
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-28 pt-14"
      >
        {/* Hero Banner */}
        <View className="mb-5 overflow-hidden rounded-3xl border border-brand-200 bg-white p-6">
          <View className="flex-row items-center gap-2.5">
            <View className="h-10 w-10 items-center justify-center rounded-2xl bg-brand-500">
              <BookOpen color="#FFFFFF" size={18} />
            </View>
            <Text className="text-sm font-bold uppercase tracking-wider text-brand-500">
              Quản lý sinh viên
            </Text>
          </View>
          <Text className="mt-3 text-xl font-bold leading-7 text-brand-900">
            {"Hệ thống quản trị\nsinh viên & đào tạo"}
          </Text>
          <Text className="mt-2 text-sm leading-5 text-brand-800/60">
            Quản lý phòng ban, lớp học, điểm số và toàn bộ hồ sơ sinh viên tại
            một nơi.
          </Text>
          <Pressable className="mt-4 flex-row items-center gap-2 self-start rounded-full bg-brand-500 px-5 py-3 active:opacity-80">
            <Text className="text-sm font-bold text-white">Xem tổng quan</Text>
            <ArrowRight color="#FFFFFF" size={16} />
          </Pressable>
        </View>

        {/* Quick Stats 2x2 */}
        <View className="mb-5 gap-3">
          <View className="flex-row gap-3">
            {quickStats.slice(0, 2).map((s) => {
              const Icon = s.icon;
              return (
                <View
                  key={s.label}
                  className={`flex-1 gap-3 rounded-2xl ${s.bg} p-4`}
                >
                  <View
                    className={`h-9 w-9 items-center justify-center rounded-xl ${s.iconBg}`}
                  >
                    <Icon color="#FFFFFF" size={16} />
                  </View>
                  <View>
                    <Text className="text-xs font-medium text-brand-800">
                      {s.label}
                    </Text>
                    <View className="flex-row items-end gap-2">
                      <Text className="text-2xl font-extrabold text-brand-900">
                        {s.value}
                      </Text>
                      <Text className="mb-0.5 text-xs font-semibold text-brand-500">
                        {s.change}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
          <View className="flex-row gap-3">
            {quickStats.slice(2).map((s) => {
              const Icon = s.icon;
              return (
                <View
                  key={s.label}
                  className={`flex-1 gap-3 rounded-2xl ${s.bg} p-4`}
                >
                  <View
                    className={`h-9 w-9 items-center justify-center rounded-xl ${s.iconBg}`}
                  >
                    <Icon color="#FFFFFF" size={16} />
                  </View>
                  <View>
                    <Text className="text-xs font-medium text-brand-800">
                      {s.label}
                    </Text>
                    <View className="flex-row items-end gap-2">
                      <Text className="text-2xl font-extrabold text-brand-900">
                        {s.value}
                      </Text>
                      <Text className="mb-0.5 text-xs font-semibold text-brand-500">
                        {s.change}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* Quản trị nhanh */}
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

        {/* Hoạt động gần đây */}
        <View className="mb-5 rounded-3xl bg-white p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Clock color="#F47C20" size={18} />
            <Text className="text-lg font-bold text-brand-900">
              Hoạt động gần đây
            </Text>
          </View>
          <View className="gap-3">
            {recentActivities.map((a, i) => (
              <View
                key={i}
                className="flex-row items-start gap-3 border-b border-brand-100 pb-3 last:border-b-0"
              >
                <View className="mt-1.5 h-2 w-2 rounded-full bg-brand-400" />
                <View className="flex-1">
                  <Text className="text-sm leading-5 text-brand-900">
                    {a.text}
                  </Text>
                  <Text className="mt-0.5 text-xs text-brand-800/50">
                    {a.time}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Nhắc nhở hôm nay */}
        <View className="rounded-3xl border border-brand-200 bg-brand-100/50 p-5">
          <View className="mb-2 flex-row items-center gap-2">
            <Clock color="#F47C20" size={18} />
            <Text className="text-base font-bold text-brand-900">
              Cần hoàn thành hôm nay
            </Text>
          </View>
          <Text className="text-sm leading-5 text-brand-800/70">
            Duyệt hồ sơ sinh viên mới, kiểm tra bảng điểm cuối kỳ và xác nhận
            danh sách lớp học kỳ tới.
          </Text>
          <Pressable className="mt-3 flex-row items-center gap-1.5 self-start">
            <Text className="text-sm font-bold text-brand-500">
              Xem chi tiết
            </Text>
            <ArrowRight color="#F47C20" size={14} />
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}