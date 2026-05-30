import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { router, useLocalSearchParams, useNavigation, useFocusEffect } from "expo-router";
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

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      setLoading(true);
      getDepartmentById(id)
        .then((data) => {
          setDept(data);
          if (data) navigation.setOptions({ title: data.name });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [id]),
  );

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF8F2" }}>
        <ActivityIndicator color="#F47C20" size="large" />
      </View>
    );
  }

  if (!dept) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF8F2" }}>
        <Text variant="title" style={{ color: "#737373" }}>Không tìm thấy Khoa</Text>
      </View>
    );
  }

  const renderRow = (IconComp: React.ComponentType<any>, label: string, value?: string | number | null) => (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
      <View style={{ height: 36, width: 36, borderRadius: 18, backgroundColor: "#F5F5F5", alignItems: "center", justifyContent: "center", marginTop: 2 }}>
        <Icon name={IconComp} size={16} color="#737373" />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="caption" style={{ color: "#A3A3A3" }}>{label}</Text>
        {value != null && String(value).trim() !== "" ? (
          <Text style={{ fontSize: 15, fontWeight: "500", color: "#1F1A17", marginTop: 2, lineHeight: 22 }}>
            {String(value)}
          </Text>
        ) : (
          <View style={{ alignSelf: "flex-start", marginTop: 4, paddingHorizontal: 10, paddingVertical: 2, backgroundColor: "#FDECEA", borderRadius: 999 }}>
            <Text style={{ fontSize: 11, fontWeight: "600", color: "#E74C3C", lineHeight: 18 }}>Chưa cập nhật</Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#FFF8F2" }} showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}>

      {/* Hero Card */}
      <View style={cardStyle}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <View style={{ height: 64, width: 64, borderRadius: 32, backgroundColor: "#FFF3E8", alignItems: "center", justifyContent: "center" }}>
            <Icon name={Building2} size={28} color="#F47C20" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F1A17", lineHeight: 26 }}>{dept.name}</Text>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 }}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 3, backgroundColor: "#FFF3E8", borderRadius: 999 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: "#F47C20", lineHeight: 20 }}>{dept.code}</Text>
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 3, backgroundColor: dept.isActive ? "#E8F8F0" : "#FDECEA", borderRadius: 999 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: dept.isActive ? "#18A957" : "#E74C3C", lineHeight: 18 }}>
                  {dept.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Text>
              </View>
            </View>
          </View>
        </View>
        {dept.description ? (
          <View style={{ backgroundColor: "#FFF8F2", borderRadius: 12, padding: 12 }}>
            <Text style={{ fontSize: 14, color: "#737373", lineHeight: 22, fontStyle: "italic" }}>{dept.description}</Text>
          </View>
        ) : null}
      </View>

      {/* Thông tin chung */}
      <InfoCard title="Thông tin chung">
        {renderRow(Calendar, "Năm thành lập", dept.established_year)}
        {renderRow(MapPin,   "Địa điểm",      dept.location)}
      </InfoCard>

      {/* Ban lãnh đạo */}
      <InfoCard title="Ban lãnh đạo">
        {renderRow(User, "Trưởng Khoa",     dept.head_of_department)}
        {renderRow(User, "Phó Trưởng Khoa", dept.deputy_head)}
      </InfoCard>

      {/* Liên hệ */}
      <InfoCard title="Liên hệ">
        {renderRow(Mail,  "Email",           dept.email)}
        {renderRow(Phone, "Số điện thoại",   dept.phone)}
      </InfoCard>

      <Button className="rounded-full bg-brand-500" icon={Pencil}
        onPress={() => router.push(`/(departments)/departments-edit/${id}`)}>
        Chỉnh sửa thông tin
      </Button>
    </ScrollView>
  );
}

const cardStyle = {
  backgroundColor: "#FFFFFF", borderRadius: 20, padding: 20, marginBottom: 16,
  borderWidth: 1, borderColor: "#F0F0F0",
  shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
};

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ ...cardStyle, gap: 16 }}>
      <Text style={{ fontSize: 11, fontWeight: "700", color: "#D96A15", letterSpacing: 1, textTransform: "uppercase", borderBottomWidth: 1, borderColor: "#FFF0E5", paddingBottom: 10 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}
