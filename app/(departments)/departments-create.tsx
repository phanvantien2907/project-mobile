import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { router, useNavigation } from "expo-router";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Building2, Hash, AlignLeft, User, Phone, Mail, MapPin, Calendar } from "lucide-react-native";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { createDepartment } from "@/services/departments";

// ─── Types ───────────────────────────────────────────────────────────────────
type FormData = {
  name: string;            code: string;
  description: string;     head_of_department: string;
  deputy_head: string;     established_year: string;
  email: string;           phone: string;
  location: string;
};

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function DepartmentsCreateScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: "", code: "", description: "", head_of_department: "",
      deputy_head: "", established_year: "", email: "", phone: "", location: "",
    },
  });

  useEffect(() => {
    navigation.setOptions({ title: "Thêm Khoa" });
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await createDepartment({
        name:               data.name,
        code:               data.code.toUpperCase(),
        description:        data.description || undefined,
        head_of_department: data.head_of_department || undefined,
        deputy_head:        data.deputy_head || undefined,
        established_year:   data.established_year ? parseInt(data.established_year) : undefined,
        email:              data.email || undefined,
        phone:              data.phone || undefined,
        location:           data.location || undefined,
        isActive: true,
      });
      Toast.show({ type: "success", text1: "Thành công", text2: "Đã thêm Khoa mới" });
      router.back();
    } catch {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Đã có lỗi xảy ra" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-brand-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: insets.bottom + 32 }}
      >
        <SectionHeader title="Thông tin cơ bản" />
        <View className="mb-6 gap-3">
          <Controller control={control} name="name" rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input placeholder="Tên Khoa *" value={value} onChangeText={onChange}
                variant="outline" icon={Building2} error={error ? "Vui lòng nhập tên Khoa" : undefined} />
            )} />
          <Controller control={control} name="code" rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input placeholder="Mã Khoa * (VD: CNTT)" value={value} onChangeText={onChange}
                variant="outline" icon={Hash} autoCapitalize="characters"
                error={error ? "Vui lòng nhập mã Khoa" : undefined} />
            )} />
          <Controller control={control} name="description"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Mô tả ngắn về Khoa (tuỳ chọn)" value={value} onChangeText={onChange}
                variant="outline" icon={AlignLeft} type="textarea" rows={3} />
            )} />
          <Controller control={control} name="established_year"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Năm thành lập (VD: 1995)" value={value} onChangeText={onChange}
                variant="outline" icon={Calendar} keyboardType="number-pad" />
            )} />
        </View>

        <SectionHeader title="Ban lãnh đạo & Liên hệ" />
        <View className="mb-8 gap-3">
          <Controller control={control} name="head_of_department"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Trưởng Khoa" value={value} onChangeText={onChange}
                variant="outline" icon={User} />
            )} />
          <Controller control={control} name="deputy_head"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Phó Trưởng Khoa" value={value} onChangeText={onChange}
                variant="outline" icon={User} />
            )} />
          <Controller control={control} name="email"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Email văn phòng" value={value} onChangeText={onChange}
                variant="outline" icon={Mail} keyboardType="email-address" autoCapitalize="none" />
            )} />
          <Controller control={control} name="phone"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Số điện thoại văn phòng" value={value} onChangeText={onChange}
                variant="outline" icon={Phone} keyboardType="phone-pad" />
            )} />
          <Controller control={control} name="location"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Địa điểm / Phòng làm việc" value={value} onChangeText={onChange}
                variant="outline" icon={MapPin} />
            )} />
        </View>

        <View className="flex-row gap-3">
          <Button variant="secondary" onPress={() => router.back()} disabled={loading}
            className="flex-1 rounded-full bg-[#FFEEDD]" textStyle={{ color: "#D96A15" }}>
            Hủy
          </Button>
          <Button onPress={handleSubmit(onSubmit)} loading={loading}
            className="flex-1 rounded-full bg-brand-500">
            Thêm mới
          </Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View className="mb-3 flex-row items-center gap-2">
      <View className="h-px flex-1 bg-[#F0E0D0]" />
      <Text style={{ fontSize: 11, fontWeight: "700", color: "#D96A15", letterSpacing: 1, textTransform: "uppercase" }}>{title}</Text>
      <View className="h-px flex-1 bg-[#F0E0D0]" />
    </View>
  );
}
