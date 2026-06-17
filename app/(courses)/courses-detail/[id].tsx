import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Pencil,
  BookOpen,
  User,
  Calendar,
  Users,
  Award,
  Building2,
  Layers,
  LayoutList,
} from "lucide-react-native";

import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import {
  ICourse,
  getCourseByID,
  getCourseTypeLabel,
  COURSE_TYPE_CONFIG,
} from "@/services/courses";

export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [course, setCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await getCourseByID(id).catch(() => null);
      setCourse(data);
      if (data) navigation.setOptions({ title: data.course_name });
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

  if (!course) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-50">
        <Text variant="title" style={{ color: "#737373" }}>
          Không tìm thấy môn học
        </Text>
      </View>
    );
  }

  const typeConfig = course.course_type
    ? COURSE_TYPE_CONFIG[course.course_type]
    : COURSE_TYPE_CONFIG.required;

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
        <View className="mb-3 flex-row items-center gap-4">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-brand-50">
            <Icon name={BookOpen} size={28} color="#F47C20" />
          </View>
          <View className="flex-1">
            <Text className="text-[18px] font-bold leading-[26px] text-neutral-900">
              {course.course_name}
            </Text>
            <View className="mt-1 flex-row flex-wrap items-center gap-1.5">
              {/* Mã môn */}
              <View className="rounded-full bg-brand-50 px-2.5 py-0.5">
                <Text className="text-[12px] font-bold leading-[18px] text-brand-500">
                  {course.course_code}
                </Text>
              </View>
              {/* Loại môn */}
              <View
                className="rounded-full px-2.5 py-0.5"
                style={{ backgroundColor: typeConfig.bg }}
              >
                <Text
                  className="text-[12px] font-semibold leading-[18px]"
                  style={{ color: typeConfig.text }}
                >
                  {typeConfig.label}
                </Text>
              </View>
              {/* Status */}
              <View
                className="rounded-full px-2.5 py-0.5"
                style={{ backgroundColor: course.isActive ? "#E8F8F0" : "#FDECEA" }}
              >
                <Text
                  className="text-[12px] font-semibold leading-[18px]"
                  style={{ color: course.isActive ? "#18A957" : "#E74C3C" }}
                >
                  {course.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tín chỉ highlight */}
        <View className="flex-row items-center gap-3 rounded-xl bg-[#FFF8E0] p-3.5">
          <Icon name={Award} size={20} color="#F0A500" />
          <View>
            <Text className="text-[12px] leading-[18px] text-[#A38050]">Số tín chỉ</Text>
            <Text className="text-[22px] font-extrabold leading-[30px] text-[#F0A500]">
              {course.course_credits}
              <Text className="text-sm font-normal text-[#A38050]"> tín chỉ</Text>
            </Text>
          </View>
        </View>

        {/* Mô tả */}
        {course.description ? (
          <View className="mt-3 rounded-xl bg-brand-50 p-3">
            <Text className="text-sm italic leading-[22px] text-neutral-500">
              {course.description}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Thông tin môn học */}
      <InfoCard title="Thông tin môn học">
        {renderRow(Building2, "Khoa / Ngành", course.department_name)}
        {renderRow(BookOpen, "Loại môn", getCourseTypeLabel(course.course_type))}
      </InfoCard>

      {/* Kế hoạch giảng dạy */}
      <InfoCard title="Kế hoạch giảng dạy">
        {renderRow(User,         "Giảng viên",      course.lecturer)}
        {renderRow(Calendar,     "Học kỳ",        course.semester)}
        {renderRow(Layers,       "Phân kỳ",        course.semester_period ? `Kỳ ${course.semester_period}` : undefined)}
        {renderRow(LayoutList,   "Phân tiết",     course.lesson_distribution)}
        {renderRow(Users,        "Sĩ số tối đa",   course.max_students)}
      </InfoCard>

      <Button
        className="rounded-full bg-brand-500"
        icon={Pencil}
        onPress={() => router.push(`/(courses)/courses-edit/${id}`)}
      >
        Chỉnh sửa thông tin
      </Button>
    </ScrollView>
  );
}

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="mb-4 gap-4 rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm elevation-2">
      <Text style={{ fontSize: 11, fontWeight: "700", color: "#D96A15", letterSpacing: 1, textTransform: "uppercase", borderBottomWidth: 1, borderColor: "#FFF0E5", paddingBottom: 10 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}
