import { CircleAlert, CircleCheckBig, Info } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";
import Toast, { ToastConfig, ToastConfigParams } from "react-native-toast-message";

type ToastData = {
  text1?: string;
  text2?: string;
};

type ToastCardProps = {
  title?: string;
  subtitle?: string;
  accentColor: string;
  backgroundColor: string;
  onPress?: () => void;
};

function ToastCard({
  title,
  subtitle,
  accentColor,
  backgroundColor,
  onPress,
}: ToastCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[92%] self-center rounded-3xl border border-white/60 px-4 py-3 shadow-sm"
      style={{ backgroundColor }}
    >
      <View className="flex-row items-center gap-3">
        <View
          className="h-9 w-9 items-center justify-center rounded-full"
          style={{ backgroundColor: `${accentColor}22` }}
        >
          {accentColor === "#18A957" ? (
            <CircleCheckBig size={19} color={accentColor} />
          ) : accentColor === "#E74C3C" ? (
            <CircleAlert size={19} color={accentColor} />
          ) : (
            <Info size={19} color={accentColor} />
          )}
        </View>

        <View className="flex-1">
          <Text className="text-sm font-semibold text-neutral-900">{title}</Text>
          {!!subtitle && (
            <Text className="mt-0.5 text-xs text-neutral-700">{subtitle}</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const toastConfig: ToastConfig = {
  success: ({ text1, text2 }: ToastConfigParams<ToastData>) => (
    <ToastCard
      title={text1}
      subtitle={text2}
      accentColor="#18A957"
      backgroundColor="#EEFDF3"
      onPress={() => Toast.hide()}
    />
  ),
  error: ({ text1, text2 }: ToastConfigParams<ToastData>) => (
    <ToastCard
      title={text1}
      subtitle={text2}
      accentColor="#E74C3C"
      backgroundColor="#FFF0EE"
      onPress={() => Toast.hide()}
    />
  ),
  info: ({ text1, text2 }: ToastConfigParams<ToastData>) => (
    <ToastCard
      title={text1}
      subtitle={text2}
      accentColor="#2667FF"
      backgroundColor="#EFF4FF"
      onPress={() => Toast.hide()}
    />
  ),
};

export default function AppToast() {
  return <Toast config={toastConfig} topOffset={56} visibilityTime={2500} />;
}
