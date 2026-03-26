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
import { GraduationCap, X, Mail, Phone, Hash, BookOpen } from "lucide-react-native";
import { updateStudent, IStudent } from "@/services/students";
import { BaseDialogProps } from "@/types/dialog";

interface Props extends BaseDialogProps {
  initialData?: IStudent | null;
}

type FormData = {
  student_code: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  course_id: string;
};

export default function UpdateStudent({
  visible,
  onClose,
  onSuccess,
  initialData,
}: Props) {
  const { control, handleSubmit, reset } = useForm<FormData>({
    defaultValues: {
      student_code: "",
      student_name: "",
      student_email: "",
      student_phone: "",
      course_id: "",
    },
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible && initialData) {
      reset({
        student_code: initialData.student_code || "",
        student_name: initialData.student_name || "",
        student_email: initialData.student_email || "",
        student_phone: initialData.student_phone || "",
        course_id: initialData.course_id || "",
      });
    }
  }, [visible, initialData, reset]);

  const onSubmit = async (data: FormData) => {
    if (!initialData?.id) return;
    try {
      setLoading(true);
      await updateStudent(initialData.id, {
        student_code: data.student_code,
        student_name: data.student_name,
        student_email: data.student_email,
        student_phone: data.student_phone,
        course_id: data.course_id,
      });

      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Cập nhật sinh viên thành công",
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
              Cập nhật sinh viên
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
              { name: "student_code", placeholder: "Mã sinh viên", icon: Hash },
              { name: "student_name", placeholder: "Tên sinh viên", icon: GraduationCap },
              { name: "student_email", placeholder: "Email", icon: Mail, keyboardType: "email-address" },
              { name: "student_phone", placeholder: "Số điện thoại", icon: Phone, keyboardType: "phone-pad" },
              { name: "course_id", placeholder: "Mã Khóa học (Optional)", icon: BookOpen },
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
                      icon={field.icon}
                      keyboardType={(field.keyboardType as any) || "default"}
                    />
                  </View>
                )}
              />
            ))}
          </View>

          {/* Buttons */}
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
