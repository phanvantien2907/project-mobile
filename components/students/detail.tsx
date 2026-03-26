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
import {
  Calendar,
  Hash,
  X,
  GraduationCap,
  Mail,
  Phone,
  BookOpen,
  User,
} from "lucide-react-native";
import dayjs from "dayjs";
import { IStudent } from "@/services/students";
import { BaseDialogProps } from "@/types/dialog";

interface Props extends BaseDialogProps {
  student?: IStudent | null;
}

export default function DetailStudent({ visible, onClose, student }: Props) {
  if (!student) return null;

  const renderFieldValue = (value?: string | null) => {
    if (!value || value.trim() === "") {
      return (
        <View className="mt-1.5 self-start px-4 py-1.5 rounded-full bg-[#FDECEA]">
          <Text
            style={{ lineHeight: 18, includeFontPadding: true }}
            className="text-xs font-semibold text-[#E74C3C]"
          >
            Chưa cập nhật
          </Text>
        </View>
      );
    }
    return (
      <Text 
        numberOfLines={1} 
        adjustsFontSizeToFit 
        className="font-medium text-neutral-900 mt-0.5"
      >
        {value}
      </Text>
    );
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
              Chi tiết sinh viên
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
                <Icon name={GraduationCap} size={24} color="#F47C20" />
              </View>
              <View className="flex-1">
                <Text
                  variant="title"
                  className="text-neutral-900"
                  numberOfLines={2}
                >
                  {student.student_name}
                </Text>
                <View
                  className={`mt-1.5 self-start px-4 py-1.5 rounded-full ${
                    student.isActive ? "bg-[#E8F8F0]" : "bg-[#FDECEA]"
                  }`}
                >
                  <Text
                    style={{ lineHeight: 18, includeFontPadding: true }}
                    className={`text-xs font-semibold ${
                      student.isActive ? "text-[#18A957]" : "text-[#E74C3C]"
                    }`}
                  >
                    {student.isActive ? "Đang học" : "Đã nghỉ học"}
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
                  <Text variant="caption">Mã sinh viên</Text>
                  {renderFieldValue(student.student_code)}
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
                  <Icon name={Mail} size={16} color="#737373" />
                </View>
                <View className="flex-1">
                  <Text variant="caption">Email</Text>
                  {renderFieldValue(student.student_email)}
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
                  <Icon name={Phone} size={16} color="#737373" />
                </View>
                <View className="flex-1">
                  <Text variant="caption">Số điện thoại</Text>
                  {renderFieldValue(student.student_phone)}
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
                  <Icon name={BookOpen} size={16} color="#737373" />
                </View>
                <View className="flex-1">
                  <Text variant="caption">Mã khóa học</Text>
                  {renderFieldValue(student.course_id)}
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <View className="h-8 w-8 items-center justify-center rounded-full bg-neutral-100">
                  <Icon name={Calendar} size={16} color="#737373" />
                </View>
                <View className="flex-1">
                  <Text variant="caption">Ngày thêm</Text>
                  <Text className="font-medium text-neutral-900 mt-0.5">
                    {student.createdAt
                      ? dayjs(
                          (
                            student.createdAt as unknown as {
                              toDate: () => Date;
                            }
                          ).toDate?.() || student.createdAt,
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
