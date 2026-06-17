import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BookOpen, Hash, AlignLeft, User, Calendar, Users,
  Award, Building2, Layers, LayoutList, GraduationCap,
} from "lucide-react-native";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Select } from "@/components/ui/select";
import {
  getCourseByID,
  updateCourse,
  ICourse,
  COURSE_TYPE_OPTIONS,
  COURSE_BLOCK_OPTIONS,
  SEMESTER_PERIOD_OPTIONS,
  LESSON_DISTRIBUTION_OPTIONS,
  CourseType,
} from "@/services/courses";
import { getDepartments, IDepartment } from "@/services/departments";

// ─── Options ────────────────────────────────────────────────────────────────
const CREDIT_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({
  label: `${n} tín chỉ`,
  value: String(n),
}));
const SEMESTER_OPTIONS = [
  { label: "Học kỳ 1", value: "HK1" },
  { label: "Học kỳ 2", value: "HK2" },
  { label: "HK1 & HK2", value: "HK1 & HK2" },
  { label: "Cả năm", value: "Cả năm" },
];

type FormData = {
  // Thông tin môn học
  course_code: string;
  course_name: string;
  course_credits: string;
  course_type: CourseType | "";
  course_block: string;
  department_id: string;
  description: string;
  // Kế hoạch giảng dạy
  semester_period: string;
  semester: string;
  lesson_distribution: string;
  lecturer: string;
  max_students: string;
};

// ─── Screen ─────────────────────────────────────────────────────────────────
export default function CoursesEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [initial, setInitial] = useState<ICourse | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<IDepartment[]>([]);

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      course_code: "", course_name: "", course_credits: "3",
      course_type: "", course_block: "", department_id: "", description: "",
      semester_period: "", semester: "", lesson_distribution: "",
      lecturer: "", max_students: "",
    },
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [course, depts] = await Promise.all([
          getCourseByID(id!),
          getDepartments(),
        ]);
        setDepartments(depts);
        if (!course) return;
        setInitial(course);
        navigation.setOptions({ title: course.course_name });
        reset({
          course_code: course.course_code || "",
          course_name: course.course_name || "",
          course_credits: course.course_credits
            ? String(course.course_credits)
            : "3",
          course_type:         course.course_type || "",
          course_block:        course.course_block || "",
          department_id:       course.department_id || "",
          description:         course.description || "",
          semester_period:     course.semester_period || "",
          semester:            course.semester || "",
          lesson_distribution: course.lesson_distribution || "",
          lecturer:            course.lecturer || "",
          max_students:        course.max_students ? String(course.max_students) : "",
        });
      } catch {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không thể tải dữ liệu",
        });
      } finally {
        setLoadingData(false);
      }
    };
    load();
  }, [id]);

  const onSubmit = async (data: FormData) => {
    if (!initial?.id) return;
    try {
      setLoading(true);
      const dept = departments.find((d) => d.id === data.department_id);
      await updateCourse(initial.id, {
        course_code:         data.course_code.toUpperCase(),
        course_name:         data.course_name,
        course_credits:      parseInt(data.course_credits) || 3,
        course_type:         (data.course_type as CourseType) || "required",
        course_block:        data.course_block || undefined,
        department_id:       data.department_id || undefined,
        department_name:     dept?.name || initial.department_name,
        description:         data.description || undefined,
        semester_period:     data.semester_period || undefined,
        semester:            data.semester || undefined,
        lesson_distribution: data.lesson_distribution || undefined,
        lecturer:            data.lecturer || undefined,
        max_students:        data.max_students ? parseInt(data.max_students) : undefined,
      });
      Toast.show({ type: "success", text1: "Thành công", text2: "Cập nhật môn học thành công" });
      router.back();
    } catch {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Đã có lỗi xảy ra" });
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-50">
        <ActivityIndicator color="#F47C20" size="large" />
      </View>
    );
  }

  const deptOptions = departments.map((d) => ({ label: d.name, value: d.id }));

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-brand-50"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: insets.bottom + 32,
        }}
      >
        <SectionHeader title="Thông tin môn học" />
        <View className="mb-6 gap-3">
          <Controller
            control={control}
            name="course_code"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                placeholder="Mã môn học"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={Hash}
                autoCapitalize="characters"
                error={error ? "Vui lòng nhập mã môn học" : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="course_name"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                placeholder="Tên môn học"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={BookOpen}
                error={error ? "Vui lòng nhập tên môn học" : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="course_credits"
            render={({ field: { onChange, value } }) => (
              <Select
                options={CREDIT_OPTIONS}
                value={value || null}
                onChange={onChange}
                placeholder="Số tín chỉ"
                icon={Award}
                variant="outline"
              />
            )}
          />
          <Controller
            control={control}
            name="course_type"
            render={({ field: { onChange, value } }) => (
              <Select
                options={COURSE_TYPE_OPTIONS}
                value={value || null}
                onChange={onChange}
                placeholder="Loại môn học"
                icon={BookOpen}
                variant="outline"
              />
            )}
          />
          <Controller
            control={control}
            name="course_block"
            render={({ field: { onChange, value } }) => (
              <Select
                options={COURSE_BLOCK_OPTIONS}
                value={value || null}
                onChange={onChange}
                placeholder="Khối kiến thức"
                icon={GraduationCap}
                variant="outline"
              />
            )}
          />
          <Controller
            control={control}
            name="department_id"
            render={({ field: { onChange, value } }) => (
              <Select
                options={deptOptions}
                value={value || null}
                onChange={onChange}
                placeholder="Thuộc Khoa / Ngành"
                icon={Building2}
                variant="outline"
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Mô tả môn học (tuỳ chọn)"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={AlignLeft}
                type="textarea"
                rows={3}
              />
            )}
          />
        </View>

        <SectionHeader title="Kế hoạch giảng dạy" />
        <View className="mb-8 gap-3">
          <Controller
            control={control}
            name="semester_period"
            render={({ field: { onChange, value } }) => (
              <Select
                options={SEMESTER_PERIOD_OPTIONS}
                value={value || null}
                onChange={onChange}
                placeholder="Phân kỳ"
                icon={Layers}
                variant="outline"
              />
            )}
          />
          <Controller
            control={control}
            name="semester"
            render={({ field: { onChange, value } }) => (
              <Select
                options={SEMESTER_OPTIONS}
                value={value || null}
                onChange={onChange}
                placeholder="Học kỳ áp dụng"
                icon={Calendar}
                variant="outline"
              />
            )}
          />
          <Controller
            control={control}
            name="lesson_distribution"
            render={({ field: { onChange, value } }) => (
              <Select
                options={LESSON_DISTRIBUTION_OPTIONS}
                value={value || null}
                onChange={onChange}
                placeholder="Phân tiết"
                icon={LayoutList}
                variant="outline"
              />
            )}
          />
          <Controller
            control={control}
            name="lecturer"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Giảng viên phụ trách"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={User}
              />
            )}
          />
          <Controller
            control={control}
            name="max_students"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Sĩ số tối đa mỗi lớp"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={Users}
                keyboardType="number-pad"
              />
            )}
          />
        </View>

        <View className="flex-row gap-3">
          <Button
            variant="secondary"
            onPress={() => router.back()}
            disabled={loading}
            className="flex-1 rounded-full bg-[#FFEEDD]"
            textStyle={{ color: "#D96A15" }}
          >
            Hủy
          </Button>
          <Button
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            className="flex-1 rounded-full bg-brand-500"
          >
            Lưu thay đổi
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
      <Text style={{ fontSize: 11, fontWeight: "700", color: "#D96A15", letterSpacing: 1, textTransform: "uppercase" }}>
        {title}
      </Text>
      <View className="h-px flex-1 bg-[#F0E0D0]" />
    </View>
  );
}
