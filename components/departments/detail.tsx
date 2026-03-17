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
import { IDepartment } from "@/services/departments";
import { Building2, Calendar, Hash, X } from "lucide-react-native";
import dayjs from "dayjs";

interface Props {
  visible: boolean;
  onClose: () => void;
  department: IDepartment | null;
}

export default function DetailDepartmentComponent({
  visible,
  onClose,
  department,
}: Props) {
  if (!department) return null;

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
              Chi tiết phòng ban
            </Text>
            <Pressable
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-brand-100"
            >
              <Icon name={X} size={18} color="#D96A15" />
            </Pressable>
          </View>

          <View className="mb-6 rounded-2xl bg-white p-4 shadow-sm border border-neutral-100">
            <View className="flex-row items-center gap-3 border-b border-neutral-100 pb-4">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                <Icon name={Building2} size={24} color="#F47C20" />
              </View>
              <View className="flex-1">
                <Text
                  variant="title"
                  className="text-neutral-900"
                  numberOfLines={2}
                >
                  {department.name}
                </Text>
                <View
                  className={`mt-1.5 self-start px-4 py-1.5 rounded-full ${
                    department.isActive ? "bg-[#E8F8F0]" : "bg-[#FDECEA]"
                  }`}
                >
                  <Text
                    style={{ lineHeight: 18, includeFontPadding: true }}
                    className={`text-xs font-semibold ${
                      department.isActive ? "text-[#18A957]" : "text-[#E74C3C]"
                    }`}
                  >
                    {department.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </Text>
                </View>
              </View>
            </View>

            <View className="pt-4 gap-4">
              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
                  <Icon name={Hash} size={16} color="#737373" />
                </View>
                <View className="flex-1">
                  <Text variant="caption">Mã phòng ban</Text>
                  <Text className="font-medium text-neutral-900 mt-0.5">
                    {department.id}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
                  <Icon name={Calendar} size={16} color="#737373" />
                </View>
                <View className="flex-1">
                  <Text variant="caption">Ngày tạo</Text>
                  <Text className="font-medium text-neutral-900 mt-0.5">
                    {department.createdAt
                      ? dayjs(
                          (
                            department.createdAt as unknown as {
                              toDate: () => Date;
                            }
                          ).toDate?.() || department.createdAt,
                        ).format("DD/MM/YYYY HH:mm")
                      : "N/A"}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
                  <Icon name={Calendar} size={16} color="#737373" />
                </View>
                <View className="flex-1">
                  <Text variant="caption">Cập nhật lần cuối</Text>
                  <Text className="font-medium text-neutral-900 mt-0.5">
                    {department.updatedAt
                      ? dayjs(
                          (
                            department.updatedAt as unknown as {
                              toDate: () => Date;
                            }
                          ).toDate?.() || department.updatedAt,
                        ).format("DD/MM/YYYY HH:mm")
                      : "N/A"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <Button onPress={onClose} className="rounded-full bg-brand-500">
            Đóng
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
