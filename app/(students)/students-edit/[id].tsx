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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Select } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { AcademicYearPicker } from "@/components/ui/academic-year-picker";

import {
  GraduationCap,
  Mail,
  Phone,
  Hash,
  MapPin,
  Calendar,
  Users,
  BookMarked,
  Building2,
  Star,
} from "lucide-react-native";

import {
  getStudentByID,
  updateStudent,
  IStudent,
  GENDER_OPTIONS,
  ACADEMIC_STATUS_OPTIONS,
  Gender,
  AcademicStatus,
} from "@/services/students";
import { getDepartments, IDepartment } from "@/services/departments";

type FormData = {
  student_code: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  gender: Gender | "";
  date_of_birth: string;
  address: string;
  department_id: string;
  academic_year: string;
  class_name: string;
  gpa: string;
  academic_status: AcademicStatus | "";
};

export default function StudentsEditScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [initialStudent, setInitialStudent] = useState<IStudent | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState<IDepartment[]>([]);

  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      student_code: "",
      student_name: "",
      student_email: "",
      student_phone: "",
      gender: "",
      date_of_birth: "",
      address: "",
      department_id: "",
      academic_year: "",
      class_name: "",
      gpa: "",
      academic_status: "",
    },
  });

  useEffect(() => {
    navigation.setOptions({ title: "Chỉnh sửa sinh viên" });

    const load = async () => {
      try {
        const [students, depts] = await Promise.all([
          getStudentByID(id!),
          getDepartments(),
        ]);
        const student = students[0];
        setDepartments(depts);
        if (student) {
          setInitialStudent(student);
          navigation.setOptions({ title: student.student_name });
          reset({
            student_code: student.student_code || "",
            student_name: student.student_name || "",
            student_email: student.student_email || "",
            student_phone: student.student_phone || "",
            gender: student.gender || "",
            date_of_birth: student.date_of_birth || "",
            address: student.address || "",
            department_id: student.department_id || "",
            academic_year: student.academic_year || "",
            class_name: student.class_name || "",
            gpa: student.gpa != null ? String(student.gpa) : "",
            academic_status: student.academic_status || "",
          });
        }
      } catch {
        Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể tải dữ liệu" });
      } finally {
        setLoadingData(false);
      }
    };

    load();
  }, [id]);

  const departmentOptions = departments.map((d) => ({
    label: d.name,
    value: d.id,
  }));

  const onSubmit = async (data: FormData) => {
    if (!initialStudent?.id) return;
    try {
      setLoading(true);
      const selectedDept = departments.find((d) => d.id === data.department_id);

      await updateStudent(initialStudent.id, {
        student_code: data.student_code,
        student_name: data.student_name,
        student_email: data.student_email,
        student_phone: data.student_phone || undefined,
        gender: (data.gender as Gender) || undefined,
        date_of_birth: data.date_of_birth || undefined,
        address: data.address || undefined,
        department_id: data.department_id || undefined,
        department_name: selectedDept?.name || initialStudent.department_name,
        academic_year: data.academic_year || undefined,
        class_name: data.class_name || undefined,
        gpa: data.gpa ? parseFloat(data.gpa) : undefined,
        academic_status: (data.academic_status as AcademicStatus) || undefined,
      });

      Toast.show({ type: "success", text1: "Thành công", text2: "Cập nhật sinh viên thành công" });
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
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#FFF8F2" }}
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
        {/* --- Thông tin cơ bản --- */}
        <SectionHeader title="Thông tin cơ bản" />

        <View style={{ gap: 12, marginBottom: 24 }}>
          <Controller
            control={control}
            name="student_code"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                placeholder="Mã sinh viên *"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={Hash}
                error={error ? "Vui lòng nhập mã sinh viên" : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="student_name"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                placeholder="Họ và tên *"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={GraduationCap}
                error={error ? "Vui lòng nhập tên sinh viên" : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="student_email"
            rules={{ required: true }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <Input
                placeholder="Email *"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={Mail}
                keyboardType="email-address"
                autoCapitalize="none"
                error={error ? "Vui lòng nhập email" : undefined}
              />
            )}
          />
          <Controller
            control={control}
            name="student_phone"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Số điện thoại"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={Phone}
                keyboardType="phone-pad"
              />
            )}
          />
          <Controller
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <Select
                options={GENDER_OPTIONS}
                value={value || null}
                onChange={onChange}
                placeholder="Giới tính"
                icon={Users}
                variant="outline"
              />
            )}
          />
          <Controller
            control={control}
            name="date_of_birth"
            render={({ field: { onChange, value } }) => (
              <DatePicker
                value={value || null}
                onChange={onChange}
                placeholder="Chọn ngày sinh"
                variant="outline"
              />
            )}
          />
          <Controller
            control={control}
            name="address"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Địa chỉ"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={MapPin}
              />
            )}
          />
        </View>

        {/* --- Thông tin học vụ --- */}
        <SectionHeader title="Thông tin học vụ" />

        <View style={{ gap: 12, marginBottom: 32 }}>
          <Controller
            control={control}
            name="department_id"
            render={({ field: { onChange, value } }) => (
              <Select
                options={departmentOptions}
                value={value || null}
                onChange={onChange}
                placeholder="Chọn Khoa / Ngành"
                icon={Building2}
                variant="outline"
              />
            )}
          />
          <Controller
            control={control}
            name="academic_year"
            render={({ field: { onChange, value } }) => (
              <AcademicYearPicker
                value={value || null}
                onChange={onChange}
                placeholder="Chọn niên khóa"
                variant="outline"
              />
            )}
          />
          <Controller
            control={control}
            name="class_name"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="Tên lớp (VD: CNTT-K46)"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={BookMarked}
              />
            )}
          />
          <Controller
            control={control}
            name="gpa"
            render={({ field: { onChange, value } }) => (
              <Input
                placeholder="GPA (0.0 – 4.0)"
                value={value}
                onChangeText={onChange}
                variant="outline"
                icon={Star}
                keyboardType="decimal-pad"
              />
            )}
          />
          <Controller
            control={control}
            name="academic_status"
            render={({ field: { onChange, value } }) => (
              <Select
                options={ACADEMIC_STATUS_OPTIONS}
                value={value || null}
                onChange={onChange}
                placeholder="Tình trạng học vụ"
                icon={GraduationCap}
                variant="outline"
              />
            )}
          />
        </View>

        {/* Action Buttons */}
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button
            variant="secondary"
            onPress={() => router.back()}
            className="flex-1 rounded-full bg-[#FFEEDD]"
            textStyle={{ color: "#D96A15" }}
            disabled={loading}
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
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
      }}
    >
      <View style={{ flex: 1, height: 1, backgroundColor: "#F0E0D0" }} />
      <Text
        style={{
          fontSize: 11,
          fontWeight: "700",
          color: "#D96A15",
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {title}
      </Text>
      <View style={{ flex: 1, height: 1, backgroundColor: "#F0E0D0" }} />
    </View>
  );
}
