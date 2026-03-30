import React from "react";
import { Modal, Pressable, Text, View, ActivityIndicator } from "react-native";

interface DialogLogoutProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export default function DialogLogout({
  visible,
  onClose,
  onConfirm,
  isLoading = false,
}: DialogLogoutProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-5">
        <View className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
          <Text className="mb-2 text-center text-xl font-bold text-brand-900">
            Đăng xuất
          </Text>
          <Text className="mb-6 text-center text-base text-brand-800/70">
            Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
          </Text>

          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
              disabled={isLoading}
              className="flex-1 items-center justify-center rounded-full bg-[#FFEEDD] py-3 active:opacity-80"
            >
              <Text className="font-bold text-brand-500">Hủy</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              disabled={isLoading}
              className="flex-1 items-center justify-center rounded-full bg-brand-500 py-3 active:opacity-80 flex-row"
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="font-bold text-white">Đăng xuất</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
