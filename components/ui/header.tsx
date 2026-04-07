import { LogOut } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface HeaderComponentProps {
  onLogoutPress: () => void;
}

export default function HeaderComponent({ onLogoutPress }: HeaderComponentProps) {
  return (
    <View className="flex-row items-center justify-between mb-6">
      <View>
        <Text className="text-sm font-medium text-brand-600 mb-1">
          Chào mừng quay lại 👋
        </Text>
        <Text className="font-bold text-3xl text-brand-900">Tổng quan</Text>
      </View>
      <Pressable
        onPress={onLogoutPress}
        className="p-3 bg-white rounded-full border border-brand-200 active:opacity-70 shadow-sm"
      >
        <LogOut color="#F47C20" size={22} />
      </Pressable>
    </View>
  );
}
