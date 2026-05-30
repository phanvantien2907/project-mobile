import React, { useCallback, useState } from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import {
  router,
  useLocalSearchParams,
  useNavigation,
  useFocusEffect,
} from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Pencil,
  BookOpen,
  User,
  Calendar,
  Users,
  Award,
  Building2,
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

  useFocusEffect(
    useCallback(() => {
      if (!id) return;
      setLoading(true);
      getCourseByID(id)
        .then((data) => {
          setCourse(data);
          if (data) navigation.setOptions({ title: data.course_name });
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, [id]),
  );

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF8F2",
        }}
      >
        <ActivityIndicator color="#F47C20" size="large" />
      </View>
    );
  }

  if (!course) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FFF8F2",
        }}
      >
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
        <Text variant="caption" style={{ color: "#A3A3A3" }}>
          {label}
        </Text>
        {value != null && String(value).trim() !== "" ? (
          <Text
            style={{
              fontSize: 15,
              fontWeight: "500",
              color: "#1F1A17",
              marginTop: 2,
              lineHeight: 22,
            }}
          >
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
            <Text
              style={{
                fontSize: 11,
                fontWeight: "600",
                color: "#E74C3C",
                lineHeight: 18,
              }}
            >
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
      contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 40 }}
    >
      {/* Hero Card */}
      <View style={cardStyle}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 16,
            marginBottom: 12,
          }}
        >
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
            <Icon name={BookOpen} size={28} color="#F47C20" />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                fontSize: 18,
                fontWeight: "700",
                color: "#1F1A17",
                lineHeight: 26,
              }}
            >
              {course.course_name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                flexWrap: "wrap",
                marginTop: 4,
              }}
            >
              {/* Mã môn */}
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  backgroundColor: "#FFF3E8",
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "700",
                    color: "#F47C20",
                    lineHeight: 18,
                  }}
                >
                  {course.course_code}
                </Text>
              </View>
              {/* Loại môn */}
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  backgroundColor: typeConfig.bg,
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: typeConfig.text,
                    lineHeight: 18,
                  }}
                >
                  {typeConfig.label}
                </Text>
              </View>
              {/* Status */}
              <View
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 3,
                  backgroundColor: course.isActive ? "#E8F8F0" : "#FDECEA",
                  borderRadius: 999,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: course.isActive ? "#18A957" : "#E74C3C",
                    lineHeight: 18,
                  }}
                >
                  {course.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Tín chỉ highlight */}
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
          <Icon name={Award} size={20} color="#F0A500" />
          <View>
            <Text style={{ fontSize: 12, color: "#A38050", lineHeight: 18 }}>
              Số tín chỉ
            </Text>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "800",
                color: "#F0A500",
                lineHeight: 30,
              }}
            >
              {course.course_credits}
              <Text
                style={{ fontSize: 14, fontWeight: "400", color: "#A38050" }}
              >
                {" "}
                tín chỉ
              </Text>
            </Text>
          </View>
        </View>

        {/* Mô tả */}
        {course.description ? (
          <View
            style={{
              marginTop: 12,
              backgroundColor: "#FFF8F2",
              borderRadius: 12,
              padding: 12,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                color: "#737373",
                lineHeight: 22,
                fontStyle: "italic",
              }}
            >
              {course.description}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Thông tin môn học */}
      <InfoCard title="Thông tin môn học">
        {renderRow(Building2, "Khoa / Ngành", course.department_name)}
        {renderRow(
          BookOpen,
          "Loại môn",
          getCourseTypeLabel(course.course_type),
        )}
      </InfoCard>

      {/* Kế hoạch giảng dạy */}
      <InfoCard title="Kế hoạch giảng dạy">
        {renderRow(User, "Giảng viên", course.lecturer)}
        {renderRow(Calendar, "Học kỳ", course.semester)}
        {renderRow(Users, "Sĩ số tối đa", course.max_students)}
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

const cardStyle = {
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
};

function InfoCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={{ ...cardStyle, gap: 16 }}>
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
