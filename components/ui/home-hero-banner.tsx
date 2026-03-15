import { ArrowRight, BookOpen } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function HeroBannerComponent() {
    return (
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
    )
}