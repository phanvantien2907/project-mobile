import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { IDepartment, updateDepartment } from "@/services/departments";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { Building2, X } from "lucide-react-native";
import { BaseDialogProps } from "@/types/dialog";
import { useForm, Controller } from "react-hook-form";

interface Props extends BaseDialogProps {
  initialData: IDepartment | null;
}
type FormData = {
  name: string;
};
export default function UpdateDepartmentComponent({visible, onClose,onSuccess, initialData,}: Props) {
   const { control, handleSubmit, reset } = useForm<FormData>({ defaultValues: { name: "",  }, });
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible && initialData) {
      reset({ name: initialData.name });
    }
  }, [visible, initialData, reset]);

  const onSubmit = async (data: FormData) => {
    if (!data.name.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập tên phòng ban",
      });
      return;
    }

    if (!initialData) return;

    try {
      setLoading(true);
      await updateDepartment(initialData.id, {
        ...initialData,
        name: data.name.trim(),
      });
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Cập nhật phòng ban thành công",
      });
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Đã có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center bg-black/50 p-5">
        <Pressable
          className="absolute bottom-0 left-0 right-0 top-0"
          onPress={onClose}
        />

        <View className="rounded-3xl bg-brand-50 p-6 shadow-xl">
          <View className="mb-6 flex-row items-center justify-between">
            <Text variant="title" className="text-brand-900">
              Cập nhật phòng ban
            </Text>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-brand-100"
            >
              <Icon name={X} size={18} color="#D96A15" />
            </Pressable>
          </View>

          <View className="mb-6">
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <Input
                  placeholder="Nhập tên phòng ban..."
                  value={value}
                  onChangeText={onChange}
                  autoFocus
                  variant="outline"
                  icon={Building2}
                />
              )}
            />
          </View>

          <View className="flex-row gap-3">
            <Button
              variant="secondary"
              onPress={onClose}
              disabled={loading}
              className="flex-1 rounded-full bg-[#FFEEDD]"
              textStyle={{ color: "#D96A15" }}
            >
              Hủy
            </Button>
            <Button
              onPress={handleSubmit(onSubmit)}
              className="flex-1 cursor-pointer rounded-full bg-brand-500"
              loading={loading}
            >
              Cập nhật
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
