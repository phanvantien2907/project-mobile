import React, { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  View,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "expo-router";
import Toast from "react-native-toast-message";
import {
  Pencil,
  Plus,
  Trash2,
  MoreVertical,
  GraduationCap,
  User,
  RefreshCcw,
} from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import CreateStudent from "@/components/students/create";
import UpdateStudent from "@/components/students/update";
import DetailStudent from "@/components/students/detail";
import DeleteStudent from "@/components/students/delete";
import { deleteStudent, restoreStudent, getStudents, IStudent } from "@/services/students";

export default function StudentsScreen() {
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Unified modal state
  const [modal, setModal] = useState<
    "" | "create" | "update" | "detail" | "delete" | "action" | "restore"
  >("");
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
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đã xóa sinh viên",
      });
      fetchStudents();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể xóa sinh viên",
      });
    } finally {
      setModal("");
      setSelected(null);
    }
  };

  const confirmRestore = async () => {
    if (!selected?.id) return;
    try {
      await restoreStudent(selected.id);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đã khôi phục sinh viên",
      });
      fetchStudents();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể khôi phục sinh viên",
      });
    } finally {
      setModal("");
      setSelected(null);
    }
  };

  const getActionOptions = () => {
    const base = [
      {
        label: "Xem chi tiết",
        icon: User,
        key: "detail",
        color: "#18A957",
        bg: "#E8F8F0",
      },
    ];

    if (selected?.isActive) {
      return [
        ...base,
        {
          label: "Chỉnh sửa",
          icon: Pencil,
          key: "update",
          color: "#2667FF",
          bg: "#EFF4FF",
        },
        {
          label: "Xóa sinh viên",
          icon: Trash2,
          key: "delete",
          color: "#E74C3C",
          bg: "#FFF0EE",
        },
      ];
    }

    return [
      ...base,
      {
        label: "Khôi phục",
        icon: RefreshCcw,
        key: "restore",
        color: "#18A957",
        bg: "#E8F8F0",
      },
    ];
  };

  const renderItem = ({ item }: { item: IStudent }) => (
    <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-neutral-100">
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
          <Text variant="caption" className="text-neutral-500 mb-1">
             Mã SV: {item.student_code}
          </Text>
          <View
            className={`mt-1.5 self-start px-4 py-1.5 rounded-full ${
              item.isActive ? "bg-[#E8F8F0]" : "bg-[#FDECEA]"
            }`}
          >
            <Text
              style={{ lineHeight: 18, includeFontPadding: true }}
              className={`text-xs font-semibold ${
                item.isActive ? "text-[#18A957]" : "text-[#E74C3C]"
              }`}
            >
              {item.isActive ? "Đang học" : "Đã nghỉ học"}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => {
            setSelected(item);
            setModal("action");
          }}
          className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
        >
          <Icon name={MoreVertical} size={20} color="#737373" />
        </Pressable>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-brand-50">
      <View className="flex-1 px-5 pt-14 pb-28">
        <View className="mb-6 flex-row items-center justify-between">
          <Text variant="heading" className="text-brand-900">
            Sinh viên
          </Text>
          <Button
            size="sm"
            onPress={() => {
              setSelected(null);
              setModal("create");
            }}
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
                <Text
                  variant="caption"
                  className="mt-2 text-center text-neutral-500"
                >
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
            className="rounded-t-3xl bg-white p-6 pb-10"
            onPress={(e) => e.stopPropagation()}
          >
            <View className="mb-4 items-center">
              <View className="h-1.5 w-12 rounded-full bg-neutral-200" />
            </View>
            <Text variant="title" className="mb-6 text-center text-brand-900">
              Tùy chọn thao tác
            </Text>

            <View className="gap-3">
              {getActionOptions().map((action) => (
                <Pressable
                  key={action.key}
                  onPress={() => {
                    setModal("");
                    setTimeout(() => setModal(action.key as any), 150);
                  }}
                  className={`flex-row items-center gap-3 rounded-2xl p-4`}
                  style={{ backgroundColor: action.bg }}
                >
                  <Icon name={action.icon} size={20} color={action.color} />
                  <Text
                    className={`font-semibold`}
                    style={{ color: action.color }}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <CreateStudent
        visible={modal === "create"}
        onClose={() => setModal("")}
        onSuccess={fetchStudents}
      />
      <DetailStudent
        visible={modal === "detail"}
        onClose={() => setModal("")}
        student={selected}
      />
      <UpdateStudent
        visible={modal === "update"}
        onClose={() => setModal("")}
        onSuccess={fetchStudents}
        initialData={selected}
      />
      <DeleteStudent
        visible={modal === "delete"}
        onClose={() => setModal("")}
        onConfirm={confirmDelete}
        name={selected?.student_name}
      />
      <DeleteStudent
        isRestore
        visible={modal === "restore"}
        onClose={() => setModal("")}
        onConfirm={confirmRestore}
        name={selected?.student_name}
      />
    </SafeAreaView>
  );
}
