import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Pencil,
  GraduationCap,
  Mail,
  Phone,
  MapPin,
  Users,
  BookMarked,
  Building2,
  Star,
  Calendar,
} from "lucide-react-native";

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

  useEffect(() => {
    const load = async () => {
      const results = await getStudentByID(id).catch(() => []);
      const found = results[0] ?? null;
      setStudent(found);
      if (found) navigation.setOptions({ title: found.student_name });
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

  if (!student) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-50">
        <Text variant="title" style={{ color: "#737373" }}>
          Không tìm thấy sinh viên
        </Text>
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
      className="flex-1 bg-brand-50"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
    >
      {/* Hero Card */}
      <View className="mb-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm elevation-2">
        {/* Avatar + Name */}
        <View className="mb-4 flex-row items-center gap-4">
          {/* Avatar circle với initials */}
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <Text style={{ fontSize: 22, fontWeight: "800", color: "#F47C20" }}>
              {student.student_name?.charAt(0)?.toUpperCase() ?? "S"}
            </Text>
          </View>
          <View className="flex-1">
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#1F1A17", lineHeight: 26 }}>
              {student.student_name}
            </Text>
            {/* Mã sinh viên badge */}
            <View className="mt-1 flex-row items-center gap-1.5 self-start rounded-full bg-brand-50 px-2.5 py-0.5">
              <Text style={{ fontSize: 12, fontWeight: "700", color: "#F47C20", letterSpacing: 0.5 }}>
                {student.student_code}
              </Text>
            </View>
            {/* Status badge */}
            <View
              className="mt-1.5 self-start rounded-full px-3 py-0.5"
              style={{ backgroundColor: statusConfig.bg }}
            >
              <Text style={{ fontSize: 12, fontWeight: "600", color: statusConfig.text }}>
                {statusConfig.label}
              </Text>
            </View>
          </View>
        </View>

        {/* GPA Highlight */}
        {student.gpa != null && (
          <View className="flex-row items-center gap-3 rounded-xl bg-[#FFF8E0] p-3.5">
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

      {/* Thông tin cơ bản */}
      <InfoCard title="Thông tin cơ bản">
        {renderRow(Mail,    "Email",          student.student_email)}
        {renderRow(Phone,   "Số điện thoại",  student.student_phone)}
        {renderRow(Users,   "Giới tính",      getGenderLabel(student.gender))}
        {renderRow(Calendar,"Ngày sinh",      student.date_of_birth)}
        {renderRow(MapPin,  "Địa chỉ",        student.address)}
      </InfoCard>

      {/* Thông tin học vụ */}
      <InfoCard title="Thông tin học vụ">
        {renderRow(Building2,    "Khoa / Ngành",      student.department_name)}
        {renderRow(Calendar,     "Niên khóa",         student.academic_year)}
        {renderRow(BookMarked,   "Tên lớp",           student.class_name)}
        {renderRow(GraduationCap,"Tình trạng học vụ", getAcademicStatusLabel(student.academic_status))}
      </InfoCard>

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
    <View className="mb-4 gap-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm elevation-2">
      <Text style={{ fontSize: 11, fontWeight: "700", color: "#D96A15", letterSpacing: 1, textTransform: "uppercase", borderBottomWidth: 1, borderColor: "#FFF0E5", paddingBottom: 10 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}
