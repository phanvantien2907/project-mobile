import { Clock } from "lucide-react-native";
import { Text, View } from "react-native";

const recentActivities = [
  { text: "Thêm 15 sinh viên mới vào lớp CNTT-K20", time: "10 phút trước" },
  { text: "Cập nhật điểm môn Toán - Lớp KT-K19", time: "32 phút trước" },
  { text: "Phòng Đào tạo thêm 2 môn học mới", time: "1 giờ trước" },
];
export default function ActivityComponent() {
    return (
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
    )
}