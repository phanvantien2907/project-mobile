import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import Toast from "react-native-toast-message";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { Building2, X } from "lucide-react-native";
import { updateCourse, ICourse } from "@/services/courses";
import { BaseDialogProps } from "@/types/dialog";

interface Props extends BaseDialogProps {
  initialData?: ICourse | null;
}

type FormData = {
  departmentName: string;
  courseCode: string;
  courseName: string;
  courseCredits: string;
};

export default function UpdateCourse({
  visible,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      departmentName: "",
      courseCode: "",
      courseName: "",
      courseCredits: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible && initialData) {
      reset({
        departmentName: initialData.department_name || "",
        courseCode: initialData.course_code || "",
        courseName: initialData.course_name || "",
        courseCredits: initialData.course_credits?.toString() || "",
      });
    }
  }, [visible, initialData, reset]);

  const onSubmit = async (data: FormData) => {
    if (!initialData?.id) return;
    try {
      setLoading(true);
      await updateCourse(initialData.id, {
        department_name: data.departmentName,
        course_code: data.courseCode,
        course_name: data.courseName,
        course_credits: Number(data.courseCredits),
      });

      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Cập nhật khóa học thành công",
      });
      onSuccess?.();
      onClose();
    } catch (e) {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Đã có lỗi xảy ra" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center bg-black/50 p-5"
      >
        <Pressable
          className="absolute bottom-0 left-0 right-0 top-0"
          onPress={onClose}
        />

        <View className="rounded-3xl bg-brand-50 p-6 shadow-xl">
          <View className="mb-6 flex-row items-center justify-between">
            <Text variant="title" className="text-brand-900">
              Cập nhật khóa học
            </Text>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-brand-100"
            >
              <Icon name={X} size={18} color="#D96A15" />
            </Pressable>
          </View>

          <View className="mb-6">
            {[
              { name: "departmentName", placeholder: "Tên khoa" },
              { name: "courseCode", placeholder: "Mã môn" },
              { name: "courseName", placeholder: "Tên môn" },
              {
                name: "courseCredits",
                placeholder: "Số tín chỉ",
                keyboardType: "numeric",
              },
            ].map((field) => (
              <Controller
                key={field.name}
                control={control}
                name={field.name as keyof FormData}
                render={({ field: { onChange, value } }) => (
                  <View className="mb-3">
                    <Input
                      placeholder={field.placeholder}
                      value={value}
                      onChangeText={onChange}
                      variant="outline"
                      icon={Building2}
                      keyboardType={(field.keyboardType as any) || "default"}
                    />
                  </View>
                )}
              />
            ))}
          </View>

          <View className="flex-row gap-3">
            <Button
              variant="secondary"
              onPress={onClose}
              className="flex-1 rounded-full bg-[#FFEEDD]"
              textStyle={{ color: "#D96A15" }}
              disabled={loading}
            >
              Hủy
            </Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              className="flex-1 cursor-pointer rounded-full bg-brand-500"
            >
              Cập nhật
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
