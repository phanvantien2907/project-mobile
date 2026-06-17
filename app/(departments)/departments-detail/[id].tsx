import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pencil, Building2, Hash, AlignLeft, User, Phone, Mail, MapPin, Calendar } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { IDepartment, getDepartmentById } from "@/services/departments";

export default function DepartmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [dept, setDept] = useState<IDepartment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getDepartmentById(id).catch(() => null);
      setDept(data);
      if (data) navigation.setOptions({ title: data.name });
      setLoading(false);
    };
    if (id) load();
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-50">
        <ActivityIndicator color="#F47C20" size="large" />
      </View>
    );
  }

  if (!dept) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-50">
        <Text variant="title" style={{ color: "#737373" }}>Không tìm thấy Khoa</Text>
      </View>
    );
  }

  const renderRow = (IconComp: React.ComponentType<any>, label: string, value?: string | number | null) => (
    <View className="flex-row items-start gap-3">
      <View className="mt-0.5 h-9 w-9 items-center justify-center rounded-full bg-neutral-100">
        <Icon name={IconComp} size={16} color="#737373" />
      </View>
      <View className="flex-1">
        <Text variant="caption" style={{ color: "#A3A3A3" }}>{label}</Text>
        {value != null && String(value).trim() !== "" ? (
          <Text style={{ fontSize: 15, fontWeight: "500", color: "#1F1A17", marginTop: 2, lineHeight: 22 }}>
            {String(value)}
          </Text>
        ) : (
          <View className="mt-1 self-start rounded-full bg-red-50 px-2.5 py-0.5">
            <Text style={{ fontSize: 11, fontWeight: "600", color: "#E74C3C", lineHeight: 18 }}>Chưa cập nhật</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView
      className="flex-1 bg-brand-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
    >
      {/* Hero Card */}
      <View className="mb-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm elevation-2">
        <View className="mb-4 flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <Icon name={Building2} size={28} color="#F47C20" />
          </View>
          <View className="flex-1">
            <Text className="text-[18px] font-bold leading-[26px] text-neutral-900">{dept.name}</Text>
            <View className="mt-1 flex-row items-center gap-2">
              <View className="rounded-full bg-brand-50 px-2.5 py-0.5">
                <Text className="text-[13px] font-bold leading-5 text-brand-500">{dept.code}</Text>
              </View>
              <View
                className="rounded-full px-2.5 py-0.5"
                style={{ backgroundColor: dept.isActive ? "#E8F8F0" : "#FDECEA" }}
              >
                <Text
                  className="text-[12px] font-semibold leading-[18px]"
                  style={{ color: dept.isActive ? "#18A957" : "#E74C3C" }}
                >
                  {dept.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {dept.description ? (
          <View className="rounded-xl bg-brand-50 p-3">
            <Text className="text-sm italic leading-[22px] text-neutral-500">{dept.description}</Text>
          </View>
        ) : null}
      </View>

      <InfoCard title="Thông tin chung">
        {renderRow(Calendar, "Năm thành lập", dept.established_year)}
        {renderRow(MapPin,   "Địa điểm",      dept.location)}
      </InfoCard>

      <InfoCard title="Ban lãnh đạo">
        {renderRow(User, "Trưởng Khoa",     dept.head_of_department)}
        {renderRow(User, "Phó Trưởng Khoa", dept.deputy_head)}
      </InfoCard>

      <InfoCard title="Liên hệ">
        {renderRow(Mail,  "Email",         dept.email)}
        {renderRow(Phone, "Số điện thoại", dept.phone)}
      </InfoCard>

      <Button className="rounded-full bg-brand-500" icon={Pencil}
        onPress={() => router.push(`/(departments)/departments-edit/${id}`)}>
        Chỉnh sửa thông tin
      </Button>
    </ScrollView>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-4 gap-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm elevation-2">
      <Text style={{ fontSize: 11, fontWeight: "700", color: "#D96A15", letterSpacing: 1, textTransform: "uppercase", borderBottomWidth: 1, borderColor: "#FFF0E5", paddingBottom: 10 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}
