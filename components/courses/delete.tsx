import React from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  View,
} from "react-native";
import { Text } from "@/components/ui/text";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { X, Trash2, RefreshCcw } from "lucide-react-native";
import { BaseDialogProps } from "@/types/dialog";

interface Props extends BaseDialogProps {
  name?: string;
  isRestore?: boolean;
}

export default function DeleteCourse({
  visible,
  onClose,
  onConfirm,
  name,
  isRestore,
}: Props) {
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
            <View className="flex-row items-center gap-3">
              <View className={`h-10 w-10 items-center justify-center rounded-full ${isRestore ? "bg-[#E8F8F0]" : "bg-[#FFF0EE]"}`}>
                <Icon name={isRestore ? RefreshCcw : Trash2} size={20} color={isRestore ? "#18A957" : "#E74C3C"} />
              </View>
              <Text variant="title" className="text-brand-900">
                {isRestore ? "Khôi phục khóa học" : "Xóa khóa học"}
              </Text>
            </View>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-brand-100"
            >
              <Icon name={X} size={18} color="#D96A15" />
            </Pressable>
          </View>

          <View className="mb-6">
            <Text className="text-base text-neutral-600">
              Bạn có chắc chắn muốn {isRestore ? "khôi phục" : "xóa"} khóa học{" "}
              <Text className="font-semibold text-brand-900">{name}</Text> này?
            </Text>
          </View>

          <View className="flex-row gap-3">
            <Button
              variant="secondary"
              onPress={onClose}
              className="flex-1 bg-[#FFEEDD] rounded-full"
              textStyle={{ color: "#D96A15" }}
            >
              Hủy
            </Button>
            <Button
              onPress={onConfirm}
              className={`flex-1 rounded-full ${isRestore ? "bg-[#18A957]" : "bg-[#E74C3C]"}`}
            >
              {isRestore ? "Khôi phục" : "Đồng ý"}
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
