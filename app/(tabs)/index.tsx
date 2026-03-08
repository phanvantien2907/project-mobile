import {
  BellRing,
  ChartColumnBig,
  CircleCheckBig,
  Layers3,
  ReceiptText,
  ShieldCheck,
  Users,
} from "lucide-react-native";
import { Pressable, SafeAreaView, ScrollView, Text, View } from "react-native";

const quickStats = [
  { label: "Người dùng hoạt động", value: "128", tone: "bg-[#FFF2E7]" },
  { label: "Yêu cầu chờ duyệt", value: "12", tone: "bg-[#FFE4CE]" },
  { label: "Cảnh báo hệ thống", value: "03", tone: "bg-[#FFF0E1]" },
];

const shortcuts = [
  {
    title: "Quản lý người dùng",
    description: "Phân quyền, khóa mở tài khoản",
    icon: Users,
  },
  {
    title: "Vai trò hệ thống",
    description: "Nhóm quyền và chính sách truy cập",
    icon: ShieldCheck,
  },
  {
    title: "Báo cáo",
    description: "Theo dõi chỉ số vận hành tổng quan",
    icon: ChartColumnBig,
  },
  {
    title: "Nhật ký tác vụ",
    description: "Kiểm tra thay đổi và lịch sử thao tác",
    icon: ReceiptText,
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F2]">
      <ScrollView
        className="flex-1"
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-[18px] px-5 pt-5 pb-28"
      >
        <View className="gap-4 rounded-[34px] bg-[#2D1A0D] p-[22px]">
          <View className="flex-row items-center justify-between">
            <View className="gap-1">
              <Text className="font-bold text-[#FFB77B]">Xin chào, Admin</Text>
              <Text className="text-3xl font-extrabold leading-9 text-[#FFF4EB]">
                Trung tâm quản trị hệ thống
              </Text>
            </View>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-[#F47C20]">
              <BellRing color="#FFFFFF" size={22} />
            </View>
          </View>

          <Text className="text-base leading-6 text-[#E7C9B0]">
            Dashboard ưu tiên quản trị rõ lớp dữ liệu, trạng thái hệ thống và
            hành động quan trọng trong một nhịp giao diện thống nhất.
          </Text>

          <Pressable className="self-start rounded-full bg-[#F47C20] px-5 py-3.5">
            <Text className="font-bold text-white">Mở bảng điều khiển</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-3">
          {quickStats.map((item) => (
            <View
              key={item.label}
              className={`flex-1 gap-2 rounded-[28px] p-4 ${item.tone}`}
            >
              <Text className="text-sm text-[#8B7766]">{item.label}</Text>
              <Text className="text-2xl font-bold text-[#1F1A17]">
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        <View className="gap-4 rounded-[32px] bg-white p-5 shadow-lg">
          <View className="flex-row items-center justify-between">
            <Text className="text-2xl font-bold text-[#1F1A17]">
              Tác vụ trọng tâm
            </Text>
            <View className="flex-row items-center gap-2">
              <Layers3 color="#F47C20" size={18} />
              <Text className="font-bold text-[#B86A2B]">Admin</Text>
            </View>
          </View>

          {shortcuts.map((item) => {
            const Icon = item.icon;

            return (
              <View
                key={item.title}
                className="flex-row items-center gap-[14px] rounded-[26px] bg-[#FFF8F2] p-4"
              >
                <View className="h-11 w-11 items-center justify-center rounded-full bg-[#F47C20]">
                  <Icon color="#FFFFFF" size={20} />
                </View>
                <View className="flex-1 gap-1">
                  <Text className="font-bold text-[#1F1A17]">{item.title}</Text>
                  <Text className="leading-5 text-[#8B7766]">
                    {item.description}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        <View className="gap-3 rounded-[32px] bg-[#FFF2E7] p-5">
          <View className="flex-row items-center gap-2.5">
            <CircleCheckBig color="#F47C20" size={20} />
            <Text className="text-xl font-semibold text-[#1F1A17]">
              Hôm nay cần hoàn thành
            </Text>
          </View>
          <Text className="text-base leading-6 text-[#8B7766]">
            Rà soát quyền truy cập mới, kiểm tra báo cáo vận hành và xác nhận
            các yêu cầu chờ duyệt trong ngày.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
