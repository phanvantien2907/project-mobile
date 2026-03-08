import FacebookIconComponent from "@/components/ui/facebook-icon";
import GoogleIconComponent from "@/components/ui/google-icon";
import { Pressable, Text, View } from "react-native";

export default function SocialComponents() {
  return (
    <View className="flex-row gap-3">
      <Pressable className="h-12 flex-1 flex-row items-center justify-center gap-2.5 rounded-xl border border-brand-200 bg-brand-50">
        <GoogleIconComponent />
        <Text className="text-sm font-semibold text-brand-900">Google</Text>
      </Pressable>
      <Pressable className="h-12 flex-1 flex-row items-center justify-center gap-2.5 rounded-xl border border-brand-200 bg-brand-50">
        <FacebookIconComponent />
        <Text className="text-sm font-semibold text-brand-900">Facebook</Text>
      </Pressable>
    </View>
  );
}
