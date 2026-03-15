import { ArrowRight, Clock } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function RemindComponent() {
    return (
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
    )
}