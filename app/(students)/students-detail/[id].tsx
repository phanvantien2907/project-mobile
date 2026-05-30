import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  View,
} from "react-native";
import { router, useLocalSearchParams, useNavigation, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pencil, GraduationCap, Mail, Phone, MapPin, Users, BookMarked, Building2, Star, Calendar } from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  IStudent,
  getStudentByID,
  getGenderLabel,
  getAcademicStatusLabel,
  AcademicStatus,
} from "@/services/students";

const ACADEMIC_STATUS_CONFIG: Record<AcademicStatus, { label: string; bg: string; text: string }> = {
  studying:    { label: "Đang học",       bg: "#E8F8F0", text: "#18A957" },
  graduated:   { label: "Đã tốt nghiệp", bg: "#EFF4FF", text: "#2667FF" },
  suspended:   { label: "Đình chỉ",      bg: "#FFF8E0", text: "#F0A500" },
  dropped_out: { label: "Thôi học",      bg: "#FDECEA", text: "#E74C3C" },
};

export default function StudentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [student, setStudent] = useState<IStudent | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      setLoading(true);
      getStudentByID(id)
        .then((results) => {
          const found = results[0] ?? null;
          setStudent(found);
          if (found) navigation.setOptions({ title: found.student_name });
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

  if (!student) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF8F2" }}>
        <Text variant="title" style={{ color: "#737373" }}>Không tìm thấy sinh viên</Text>
      </View>
    );
  }

  const statusKey = student.academic_status ?? (student.isActive ? "studying" : "dropped_out");
  const statusConfig = ACADEMIC_STATUS_CONFIG[statusKey as AcademicStatus] ?? ACADEMIC_STATUS_CONFIG.studying;

  const renderRow = (
    IconComp: React.ComponentType<any>,
    label: string,
    value?: string | number | null,
  ) => (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 12 }}>
      <View
        style={{
          height: 36,
          width: 36,
          borderRadius: 18,
          backgroundColor: "#F5F5F5",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 2,
        }}
      >
        <Icon name={IconComp} size={16} color="#737373" />
      </View>
      <View style={{ flex: 1 }}>
        <Text variant="caption" style={{ color: "#A3A3A3" }}>{label}</Text>
        {value != null && String(value).trim() !== "" ? (
          <Text style={{ fontSize: 15, fontWeight: "500", color: "#1F1A17", marginTop: 2, lineHeight: 22 }}>
            {String(value)}
          </Text>
        ) : (
          <View
            style={{
              alignSelf: "flex-start",
              marginTop: 4,
              paddingHorizontal: 10,
              paddingVertical: 2,
              backgroundColor: "#FDECEA",
              borderRadius: 999,
            }}
          >
            <Text style={{ fontSize: 11, fontWeight: "600", color: "#E74C3C", lineHeight: 18 }}>
              Chưa cập nhật
            </Text>
          </View>
        )}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#FFF8F2" }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        padding: 20,
        paddingBottom: insets.bottom + 40,
      }}
    >
      {/* Hero Card */}
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          padding: 20,
          marginBottom: 16,
          borderWidth: 1,
          borderColor: "#F0F0F0",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        {/* Avatar + Name */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 16, marginBottom: 16 }}>
          <View
            style={{
              height: 64,
              width: 64,
              borderRadius: 32,
              backgroundColor: "#FFF3E8",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon name={GraduationCap} size={28} color="#F47C20" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F1A17", lineHeight: 26 }}>
              {student.student_name}
            </Text>
            <Text style={{ fontSize: 13, color: "#737373", marginTop: 2, lineHeight: 20 }}>
              Mã SV: {student.student_code}
            </Text>
            <View
              style={{
                alignSelf: "flex-start",
                marginTop: 6,
                paddingHorizontal: 12,
                paddingVertical: 4,
                backgroundColor: statusConfig.bg,
                borderRadius: 999,
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: "700", color: statusConfig.text, lineHeight: 18 }}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {/* GPA Highlight */}
        {student.gpa != null && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              backgroundColor: "#FFF8E0",
              borderRadius: 14,
              padding: 14,
            }}
          >
            <Icon name={Star} size={20} color="#F0A500" />
            <View>
              <Text style={{ fontSize: 12, color: "#A38050", lineHeight: 18 }}>GPA tích lũy</Text>
              <Text style={{ fontSize: 22, fontWeight: "800", color: "#F0A500", lineHeight: 30 }}>
                {student.gpa.toFixed(2)}
                <Text style={{ fontSize: 14, fontWeight: "400", color: "#A38050" }}> / 4.0</Text>
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Thông tin cơ bản Card */}
      <InfoCard title="Thông tin cơ bản">
        {renderRow(Mail,    "Email",         student.student_email)}
        {renderRow(Phone,   "Số điện thoại", student.student_phone)}
        {renderRow(Users,   "Giới tính",     getGenderLabel(student.gender))}
        {renderRow(Calendar,"Ngày sinh",     student.date_of_birth)}
        {renderRow(MapPin,  "Địa chỉ",       student.address)}
      </InfoCard>

      {/* Thông tin học vụ Card */}
      <InfoCard title="Thông tin học vụ">
        {renderRow(Building2,    "Khoa / Ngành",     student.department_name)}
        {renderRow(Calendar,     "Niên khóa",        student.academic_year)}
        {renderRow(BookMarked,   "Tên lớp",          student.class_name)}
        {renderRow(GraduationCap,"Tình trạng học vụ", getAcademicStatusLabel(student.academic_status))}
      </InfoCard>

      {/* Edit Button */}
      <Button
        className="rounded-full bg-brand-500"
        icon={Pencil}
        onPress={() => router.push(`/(students)/students-edit/${id}`)}
      >
        Chỉnh sửa thông tin
      </Button>
    </ScrollView>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 20,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#F0F0F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        gap: 16,
      }}
    >
      <Text
        style={{
          fontSize: 11,
          fontWeight: "700",
          color: "#D96A15",
          letterSpacing: 1,
          textTransform: "uppercase",
          borderBottomWidth: 1,
          borderColor: "#FFF0E5",
          paddingBottom: 10,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}
