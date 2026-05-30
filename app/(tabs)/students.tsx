import React, { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  View,
  RefreshControl,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import Toast from "react-native-toast-message";
import {
  Plus,
  Trash2,
  MoreVertical,
  GraduationCap,
  Pencil,
  Eye,
  Star,
  Building2,
} from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import DeleteStudent from "@/components/students/delete";

import {
  deleteStudent,
  getStudents,
  IStudent,
  getAcademicStatusLabel,
} from "@/services/students";

const ACADEMIC_STATUS_STYLE: Record<string, { bg: string; text: string }> = {
  studying:    { bg: "#E8F8F0", text: "#18A957" },
  graduated:   { bg: "#EFF4FF", text: "#2667FF" },
  suspended:   { bg: "#FFF8E0", text: "#F0A500" },
  dropped_out: { bg: "#FDECEA", text: "#E74C3C" },
};

type BottomSheetModal = "" | "action" | "delete";

export default function StudentsScreen() {
  const insets = useSafeAreaInsets();
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [modal, setModal] = useState<BottomSheetModal>("");
  const [selected, setSelected] = useState<IStudent | null>(null);

  const fetchStudents = useCallback(async () => {
    try {
      const data = await getStudents();
      setStudents(data);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải danh sách sinh viên",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Refresh list khi quay lại từ create/edit screen
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchStudents();
    }, [fetchStudents]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStudents();
  }, [fetchStudents]);

  const confirmDelete = async () => {
    if (!selected?.id) return;
    try {
      await deleteStudent(selected.id);
      Toast.show({ type: "success", text1: "Thành công", text2: "Đã xóa sinh viên" });
      fetchStudents();
    } catch {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể xóa sinh viên" });
    } finally {
      setModal("");
      setSelected(null);
    }
  };

  const ACTION_OPTIONS = [
    {
      label: "Xem chi tiết",
      icon: Eye,
      key: "detail",
      color: "#18A957",
      bg: "#E8F8F0",
      onPress: () => {
        setModal("");
        if (selected?.id) router.push(`/(students)/students-detail/${selected.id}`);
      },
    },
    {
      label: "Chỉnh sửa",
      icon: Pencil,
      key: "update",
      color: "#2667FF",
      bg: "#EFF4FF",
      onPress: () => {
        setModal("");
        if (selected?.id) router.push(`/(students)/students-edit/${selected.id}`);
      },
    },
    {
      label: "Xóa sinh viên",
      icon: Trash2,
      key: "delete",
      color: "#E74C3C",
      bg: "#FFF0EE",
      onPress: () => {
        setModal("");
        setTimeout(() => setModal("delete"), 150);
      },
    },
  ];

  const renderItem = ({ item }: { item: IStudent }) => {
    const statusKey = item.academic_status ?? (item.isActive ? "studying" : "dropped_out");
    const statusStyle = ACADEMIC_STATUS_STYLE[statusKey] ?? ACADEMIC_STATUS_STYLE.studying;

    return (
      <Pressable
        onPress={() => router.push(`/(students)/students-detail/${item.id}`)}
        className="mb-3 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-neutral-100"
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <View className="flex-1 flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-50">
            <Icon name={GraduationCap} size={20} color="#F47C20" />
          </View>
          <View className="flex-1">
            <Text
              variant="subtitle"
              className="text-neutral-900 font-semibold"
              numberOfLines={1}
            >
              {item.student_name}
            </Text>
            <Text variant="caption" className="text-neutral-500">
              Mã SV: {item.student_code}
            </Text>

            {/* Khoa + GPA */}
            <View className="flex-row items-center gap-2 mt-1 flex-wrap">
              {item.department_name ? (
                <View className="flex-row items-center gap-1">
                  <Icon name={Building2} size={11} color="#A3A3A3" />
                  <Text style={{ fontSize: 11, color: "#A3A3A3", lineHeight: 16 }} numberOfLines={1}>
                    {item.department_name}
                  </Text>
                </View>
              ) : null}
              {item.gpa != null ? (
                <View className="flex-row items-center gap-1">
                  <Icon name={Star} size={11} color="#F0A500" />
                  <Text style={{ fontSize: 11, color: "#F0A500", lineHeight: 16, fontWeight: "600" }}>
                    GPA {item.gpa.toFixed(1)}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* Status Badge */}
            <View
              style={{
                marginTop: 6,
                alignSelf: "flex-start",
                borderRadius: 999,
                paddingHorizontal: 10,
                paddingVertical: 3,
                backgroundColor: statusStyle.bg,
              }}
            >
              <Text style={{ fontSize: 11, lineHeight: 16, fontWeight: "600", color: statusStyle.text }}>
                {getAcademicStatusLabel(item.academic_status ?? (item.isActive ? "studying" : "dropped_out"))}
              </Text>
            </View>
          </View>
        </View>

        {/* Action menu */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            setSelected(item);
            setModal("action");
          }}
          className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
          hitSlop={8}
        >
          <Icon name={MoreVertical} size={20} color="#737373" />
        </Pressable>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-50" edges={["top", "left", "right"]}>
      <View className="flex-1 px-5 pb-28" style={{ paddingTop: insets.top + 8 }}>
        <View className="mb-6 flex-row items-center justify-between">
          <Text variant="heading" className="text-brand-900">
            Sinh viên
          </Text>
          <Button
            size="sm"
            onPress={() => router.push("/(students)/students-create")}
            className="rounded-full bg-brand-500"
            icon={Plus}
          >
            Thêm mới
          </Button>
        </View>

        <FlatList
          data={students}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#F47C20"]}
            />
          }
          ListEmptyComponent={
            !loading ? (
              <View className="mt-20 items-center justify-center">
                <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-brand-100">
                  <Icon name={GraduationCap} size={32} color="#F47C20" />
                </View>
                <Text variant="title" className="text-center text-neutral-900">
                  Chưa có sinh viên nào
                </Text>
                <Text variant="caption" className="mt-2 text-center text-neutral-500">
                  Bấm "Thêm mới" để tạo sinh viên đầu tiên
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      {/* Action Bottom Sheet */}
      <Modal visible={modal === "action"} transparent animationType="fade">
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setModal("")}
        >
          <Pressable
            className="rounded-t-3xl bg-white p-6"
            style={{ paddingBottom: Math.max(insets.bottom + 16, 24) }}
            onPress={(e) => e.stopPropagation()}
          >
            <View className="mb-4 items-center">
              <View className="h-1.5 w-12 rounded-full bg-neutral-200" />
            </View>

            {/* Selected student name */}
            {selected && (
              <View className="mb-4">
                <Text variant="caption" className="text-center text-neutral-500">
                  Thao tác với
                </Text>
                <Text variant="title" className="text-center text-brand-900" numberOfLines={1}>
                  {selected.student_name}
                </Text>
              </View>
            )}

            <View className="gap-3">
              {ACTION_OPTIONS.map((action) => (
                <Pressable
                  key={action.key}
                  onPress={action.onPress}
                  className="flex-row items-center gap-3 rounded-2xl p-4"
                  style={{ backgroundColor: action.bg }}
                >
                  <Icon name={action.icon} size={20} color={action.color} />
                  <Text className="font-semibold" style={{ color: action.color }}>
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Delete Confirm Dialog */}
      <DeleteStudent
        visible={modal === "delete"}
        onClose={() => { setModal(""); setSelected(null); }}
        onConfirm={confirmDelete}
        name={selected?.student_name}
      />
    </SafeAreaView>
  );
}
