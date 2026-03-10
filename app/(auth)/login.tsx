import { Link, router } from "expo-router";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react-native";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import SocialComponents from "@/components/ui/social";
import { useState } from "react";
import { login } from "@/services/authen";
import Toast from "react-native-toast-message";
import { handleAuthError } from "@/services/firebase-error";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: "error", text1: "Vui lòng điền đầy đủ thông tin!" });
      return;
    }
    try {
      await login(email, password);
      Toast.show({ type: "success", text1: "Đăng nhập thành công!" });
      router.replace("/(tabs)");
    } catch (err: unknown) {
      handleAuthError(err, "Đăng nhập thất bại!");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          className="flex-1"
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName="flex-grow justify-center px-6 py-12"
        >
          <View className="mx-auto w-full max-w-sm">
            {/* Brand */}
            <View className="mb-8 items-center">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-2xl bg-brand-500">
                <ShieldCheck color="#fff" size={32} />
              </View>
              <Text className="text-2xl font-bold text-brand-900">
                Đăng nhập
              </Text>
              <Text className="mt-1 text-center text-sm text-brand-800/60">
                Truy cập trang quản trị hệ thống
              </Text>
            </View>

            {/* Form Card */}
            <View className="rounded-2xl bg-white p-6 shadow-sm">
              <View className="gap-5">
                {/* Email */}
                <View className="gap-1.5">
                  <Text className="text-sm font-medium text-brand-900">
                    Email
                  </Text>
                  <View className="h-12 flex-row items-center gap-2.5 rounded-xl border border-brand-200 bg-brand-50 px-3.5">
                    <Mail color="#D96A15" size={18} />
                    <TextInput
                      className="flex-1 text-sm text-brand-900"
                      placeholder="admin@dhv.com"
                      placeholderTextColor="#B8A99A"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      value={email}
                      onChangeText={setEmail}
                    />
                  </View>
                </View>

                {/* Password */}
                <View className="gap-1.5">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-medium text-brand-900">
                      Mật khẩu
                    </Text>
                    <Pressable hitSlop={8}>
                      <Text className="text-xs font-semibold text-brand-500">
                        Quên mật khẩu?
                      </Text>
                    </Pressable>
                  </View>
                  <View className="h-12 flex-row items-center gap-2.5 rounded-xl border border-brand-200 bg-brand-50 px-3.5">
                    <LockKeyhole color="#D96A15" size={18} />
                    <TextInput
                      className="flex-1 text-sm text-brand-900"
                      placeholder="Nhập mật khẩu"
                      placeholderTextColor="#B8A99A"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />
                  </View>
                </View>

                {/* Submit */}
                <Pressable
                  className="mt-1 h-14 items-center justify-center rounded-xl bg-brand-500"
                  onPress={handleLogin}
                >
                  <Text className="text-base font-bold text-white">
                    Đăng nhập
                  </Text>
                </Pressable>

                {/* Divider */}
                <View className="flex-row items-center gap-3">
                  <View className="h-px flex-1 bg-brand-200" />
                  <Text className="text-xs font-medium text-brand-800/40">
                    hoặc tiếp tục với
                  </Text>
                  <View className="h-px flex-1 bg-brand-200" />
                </View>

                {/* Social Login */}
                <SocialComponents />
              </View>
            </View>

            {/* Footer */}
            <View className="mt-8 flex-row items-center justify-center gap-1.5">
              <Text className="text-sm text-brand-800/50">
                Chưa có tài khoản?
              </Text>
              <Link href="/(auth)/register" asChild>
                <Pressable hitSlop={8}>
                  <Text className="text-sm font-bold text-brand-500">
                    Đăng ký
                  </Text>
                </Pressable>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
