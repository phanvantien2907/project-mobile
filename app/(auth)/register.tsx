import { Link, router } from "expo-router";
import { LockKeyhole, Mail, UserPlus } from "lucide-react-native";
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

export default function RegisterScreen() {
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
                <UserPlus color="#fff" size={32} />
              </View>
              <Text className="text-2xl font-bold text-brand-900">
                Tạo tài khoản
              </Text>
              <Text className="mt-1 text-center text-sm text-brand-800/60">
                Đăng ký tài khoản quản trị mới
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
                      placeholder="admin@company.com"
                      placeholderTextColor="#B8A99A"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>
                </View>

                {/* Password */}
                <View className="gap-1.5">
                  <Text className="text-sm font-medium text-brand-900">
                    Mật khẩu
                  </Text>
                  <View className="h-12 flex-row items-center gap-2.5 rounded-xl border border-brand-200 bg-brand-50 px-3.5">
                    <LockKeyhole color="#D96A15" size={18} />
                    <TextInput
                      className="flex-1 text-sm text-brand-900"
                      placeholder="Tạo mật khẩu"
                      placeholderTextColor="#B8A99A"
                      secureTextEntry
                    />
                  </View>
                </View>

                {/* Confirm Password */}
                <View className="gap-1.5">
                  <Text className="text-sm font-medium text-brand-900">
                    Xác nhận mật khẩu
                  </Text>
                  <View className="h-12 flex-row items-center gap-2.5 rounded-xl border border-brand-200 bg-brand-50 px-3.5">
                    <LockKeyhole color="#D96A15" size={18} />
                    <TextInput
                      className="flex-1 text-sm text-brand-900"
                      placeholder="Nhập lại mật khẩu"
                      placeholderTextColor="#B8A99A"
                      secureTextEntry
                    />
                  </View>
                </View>

                {/* Submit */}
                <Pressable
                  className="mt-1 h-14 items-center justify-center rounded-xl bg-brand-500"
                  onPress={() => router.replace("/(tabs)")}
                >
                  <Text className="text-base font-bold text-white">
                    Tạo tài khoản
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
                Đã có tài khoản?
              </Text>
              <Link href="/(auth)/login" asChild>
                <Pressable hitSlop={8}>
                  <Text className="text-sm font-bold text-brand-500">
                    Đăng nhập
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
