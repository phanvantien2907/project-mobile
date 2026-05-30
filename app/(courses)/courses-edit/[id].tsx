import React, { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Select } from "@/components/ui/select";

import { BookOpen, Hash, AlignLeft, User, Calendar, Users, Award, Building2 } from "lucide-react-native";

import { getCourseByID, updateCourse, ICourse, COURSE_TYPE_OPTIONS, CourseType } from "@/services/courses";
import { getDepartments, IDepartment } from "@/services/departments";

const CREDIT_OPTIONS = [1, 2, 3, 4, 5].map((n) => ({ label: `${n} tín chỉ`, value: String(n) }));
const SEMESTER_OPTIONS = [
  { label: "Học kỳ 1", value: "HK1" },
  { label: "Học kỳ 2", value: "HK2" },
  { label: "HK1 & HK2", value: "HK1 & HK2" },
  { label: "Cả năm", value: "Cả năm" },
];

type FormData = {
  course_code: string; course_name: string; course_credits: string;
  course_type: CourseType | ""; department_id: string;
  description: string; lecturer: string; semester: string; max_students: string;
};

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
      course_type: "", department_id: "",
      description: "", lecturer: "", semester: "", max_students: "",
    },
  });

  useEffect(() => {
    navigation.setOptions({ title: "Chỉnh sửa môn học" });
    Promise.all([getCourseByID(id!), getDepartments()])
      .then(([course, depts]) => {
        setDepartments(depts);
        if (course) {
          setInitial(course);
          navigation.setOptions({ title: course.course_name });
          reset({
            course_code: course.course_code || "",
            course_name: course.course_name || "",
            course_credits: course.course_credits ? String(course.course_credits) : "3",
            course_type: course.course_type || "",
            department_id: course.department_id || "",
            description: course.description || "",
            lecturer: course.lecturer || "",
            semester: course.semester || "",
            max_students: course.max_students ? String(course.max_students) : "",
          });
        }
      })
      .catch(() => Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể tải dữ liệu" }))
      .finally(() => setLoadingData(false));
  }, [id]);

  const deptOptions = departments.map((d) => ({ label: d.name, value: d.id }));

  const onSubmit = async (data: FormData) => {
    if (!initial?.id) return;
    try {
      setLoading(true);
      const dept = departments.find((d) => d.id === data.department_id);
      await updateCourse(initial.id, {
        course_code: data.course_code.toUpperCase(),
        course_name: data.course_name,
        course_credits: parseInt(data.course_credits) || 3,
        course_type: (data.course_type as CourseType) || "required",
        department_id: data.department_id || undefined,
        department_name: dept?.name || initial.department_name,
        description: data.description || undefined,
        lecturer: data.lecturer || undefined,
        semester: data.semester || undefined,
        max_students: data.max_students ? parseInt(data.max_students) : undefined,
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
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#FFF8F2" }}>
        <ActivityIndicator color="#F47C20" size="large" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "#FFF8F2" }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: insets.bottom + 32 }}>

        <SectionHeader title="Thông tin môn học" />
        <View style={{ gap: 12, marginBottom: 24 }}>
          <Controller control={control} name="course_code" rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input placeholder="Mã môn học * (VD: IT001)" value={value} onChangeText={onChange}
                variant="outline" icon={Hash} autoCapitalize="characters"
                error={error ? "Vui lòng nhập mã môn học" : undefined} />
            )} />
          <Controller control={control} name="course_name" rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input placeholder="Tên môn học *" value={value} onChangeText={onChange}
                variant="outline" icon={BookOpen}
                error={error ? "Vui lòng nhập tên môn học" : undefined} />
            )} />
          <Controller control={control} name="course_credits"
            render={({ field: { onChange, value } }) => (
              <Select options={CREDIT_OPTIONS} value={value || null} onChange={onChange}
                placeholder="Số tín chỉ" icon={Award} variant="outline" />
            )} />
          <Controller control={control} name="course_type"
            render={({ field: { onChange, value } }) => (
              <Select options={COURSE_TYPE_OPTIONS} value={value || null} onChange={onChange}
                placeholder="Loại môn học" icon={BookOpen} variant="outline" />
            )} />
          <Controller control={control} name="department_id"
            render={({ field: { onChange, value } }) => (
              <Select options={deptOptions} value={value || null} onChange={onChange}
                placeholder="Thuộc Khoa / Ngành" icon={Building2} variant="outline" />
            )} />
          <Controller control={control} name="description"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Mô tả môn học (tuỳ chọn)" value={value} onChangeText={onChange}
                variant="outline" icon={AlignLeft} type="textarea" rows={3} />
            )} />
        </View>

        <SectionHeader title="Kế hoạch giảng dạy" />
        <View style={{ gap: 12, marginBottom: 32 }}>
          <Controller control={control} name="lecturer"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Giảng viên phụ trách" value={value} onChangeText={onChange}
                variant="outline" icon={User} />
            )} />
          <Controller control={control} name="semester"
            render={({ field: { onChange, value } }) => (
              <Select options={SEMESTER_OPTIONS} value={value || null} onChange={onChange}
                placeholder="Học kỳ áp dụng" icon={Calendar} variant="outline" />
            )} />
          <Controller control={control} name="max_students"
            render={({ field: { onChange, value } }) => (
              <Input placeholder="Sĩ số tối đa mỗi lớp" value={value} onChangeText={onChange}
                variant="outline" icon={Users} keyboardType="number-pad" />
            )} />
        </View>

        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button variant="secondary" onPress={() => router.back()} disabled={loading}
            className="flex-1 rounded-full bg-[#FFEEDD]" textStyle={{ color: "#D96A15" }}>Hủy</Button>
          <Button onPress={handleSubmit(onSubmit)} loading={loading}
            className="flex-1 rounded-full bg-brand-500">Lưu thay đổi</Button>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 12 }}>
      <View style={{ flex: 1, height: 1, backgroundColor: "#F0E0D0" }} />
      <Text style={{ fontSize: 11, fontWeight: "700", color: "#D96A15", letterSpacing: 1, textTransform: "uppercase" }}>{title}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: "#F0E0D0" }} />
    </View>
  );
}
