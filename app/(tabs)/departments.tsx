import CreateDepartmentComponent from "@/components/departments/create";
import DetailDepartmentComponent from "@/components/departments/detail";
import UpdateDepartmentComponent from "@/components/departments/update";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  deleteDepartment,
  getDepartments,
  IDepartment,
} from "@/services/departments";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, FlatList, Modal, Pressable, SafeAreaView, View } from "react-native";
import Toast from "react-native-toast-message";
import { Building2, Pencil, Plus, Trash2, MoreVertical } from "lucide-react-native";
import DeleteDepartmentComponent from "@/components/departments/delete";

export default function DepartmentsScreen() {
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);
  const [detailModalVisible, setDetailModalVisible] = useState<boolean>(false);
  const [selectedDept, setSelectedDept] = useState<IDepartment | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deptToDelete, setDeptToDelete] = useState<IDepartment | null>(null);
  const [actionModalVisible, setActionModalVisible] = useState<boolean>(false);

  const fetchDepartments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getDepartments();
      setDepartments(data);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải danh sách phòng ban",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDepartments();
    }, [fetchDepartments]),
  );

  const confirmDelete = async () => {
    if (!deptToDelete || !deptToDelete.id) return;
    try {
      await deleteDepartment(deptToDelete.id);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đã xóa phòng ban",
      });
      fetchDepartments();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể xóa phòng ban",
      });
    } finally {
      setDeleteModalVisible(false);
      setDeptToDelete(null);
    }
  };

  const handleDelete = (department: IDepartment) => {
    setDeptToDelete(department);
    setDeleteModalVisible(true);
  };

  const renderItem = ({ item }: { item: IDepartment }) => (
    <View className="mb-3 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-neutral-100">
      <View className="flex-1 flex-row items-center gap-3">
        <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-50">
          <Icon name={Building2} size={20} color="#F47C20" />
        </View>
        <View className="flex-1">
          <Text
            variant="subtitle"
            className="text-neutral-900 font-semibold"
            numberOfLines={1}
          >
            {item.name}
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
              {item.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
            </Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-2">
        <Pressable
          onPress={() => {
            setSelectedDept(item);
            setActionModalVisible(true);
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
            Phòng ban
          </Text>
          <Button
            size="sm"
            onPress={() => {
              setCreateModalVisible(true);
            }}
            className="rounded-full bg-brand-500"
            icon={Plus}
          >
            Thêm mới
          </Button>
        </View>

        <FlatList
          data={departments}
          keyExtractor={(item, index) => item.id || index.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            !loading ? (
              <View className="mt-20 items-center justify-center">
                <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-brand-100">
                  <Icon name={Building2} size={32} color="#F47C20" />
                </View>
                <Text variant="title" className="text-center text-neutral-900">
                  Chưa có phòng ban nào
                </Text>
                <Text
                  variant="caption"
                  className="mt-2 text-center text-neutral-500"
                >
                  Bấm "Thêm mới" để tạo phòng ban đầu tiên
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      {/* Action Bottom Sheet */}
      <Modal visible={actionModalVisible} transparent animationType="fade">
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setActionModalVisible(false)}
        >
          <Pressable className="rounded-t-3xl bg-white p-6 pb-10" onPress={(e) => e.stopPropagation()}>
            <View className="mb-4 items-center">
              <View className="h-1.5 w-12 rounded-full bg-neutral-200" />
            </View>
            <Text variant="title" className="mb-6 text-center text-brand-900">
              Tùy chọn thao tác
            </Text>

            <View className="gap-3">
              <Pressable
                onPress={() => {
                  setActionModalVisible(false);
                  setTimeout(() => setDetailModalVisible(true), 150);
                }}
                className="flex-row items-center gap-3 rounded-2xl bg-[#E8F8F0] p-4"
              >
                <Icon name={Building2} size={20} color="#18A957" />
                <Text className="font-semibold text-[#18A957]">Xem chi tiết</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setActionModalVisible(false);
                  setTimeout(() => setUpdateModalVisible(true), 150);
                }}
                className="flex-row items-center gap-3 rounded-2xl bg-[#EFF4FF] p-4"
              >
                <Icon name={Pencil} size={20} color="#2667FF" />
                <Text className="font-semibold text-[#2667FF]">Chỉnh sửa</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setActionModalVisible(false);
                  setTimeout(() => {
                    if (selectedDept) handleDelete(selectedDept);
                  }, 150);
                }}
                className="flex-row items-center gap-3 rounded-2xl bg-[#FFF0EE] p-4"
              >
                <Icon name={Trash2} size={20} color="#E74C3C" />
                <Text className="font-semibold text-[#E74C3C]">Xóa phòng ban</Text>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <CreateDepartmentComponent
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={fetchDepartments}
      />
      <DetailDepartmentComponent
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        department={selectedDept}
      />
      <UpdateDepartmentComponent
        visible={updateModalVisible}
        onClose={() => setUpdateModalVisible(false)}
        onSuccess={fetchDepartments}
        initialData={selectedDept}
      />
      <DeleteDepartmentComponent
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={confirmDelete}
        name={deptToDelete?.name}
      />
    </SafeAreaView>
  );
}
