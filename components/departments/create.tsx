import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { createDepartment } from "@/services/departments";
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

interface Props extends BaseDialogProps {}

export default function CreateDepartmentComponent({
  visible,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (visible) {
      setName("");
    }
  }, [visible]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập tên phòng ban",
      });
      return;
    }

    try {
      setLoading(true);
      await createDepartment({
        id: "",
        name: name.trim(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
      });
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Thêm phòng ban thành công",
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
        className="flex-1 justify-center bg-black/50 p-5"
      >
        <Pressable
          className="absolute bottom-0 left-0 right-0 top-0"
          onPress={onClose}
        />

        <View className="rounded-3xl bg-brand-50 p-6 shadow-xl">
          <View className="mb-6 flex-row items-center justify-between">
            <Text variant="title" className="text-brand-900">
              Thêm phòng ban mới
            </Text>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-brand-100"
            >
              <Icon name={X} size={18} color="#D96A15" />
            </Pressable>
          </View>

          <View className="mb-6">
            <Input
              placeholder="Nhập tên phòng ban..."
              value={name}
              onChangeText={setName}
              autoFocus
              variant="outline"
              icon={Building2}
            />
          </View>

          <View className="flex-row gap-3">
            <Button
              variant="secondary"
              onPress={onClose}
              disabled={loading}
              className="flex-1 bg-[#FFEEDD] rounded-full"
              textStyle={{ color: "#D96A15" }}
            >
              Hủy
            </Button>
            <Button
              onPress={handleSubmit}
              className="flex-1 bg-brand-500 rounded-full"
              loading={loading}
            >
              Thêm mới
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
