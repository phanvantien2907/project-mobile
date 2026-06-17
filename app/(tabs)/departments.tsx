import React, { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, View, RefreshControl } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import {
  Building2,
  Eye,
  Pencil,
  Plus,
  Trash2,
  MoreVertical,
  Hash,
} from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import DeleteDepartmentComponent from "@/components/departments/delete";
import {
  deleteDepartment,
  getDepartments,
  IDepartment,
} from "@/services/departments";
type BottomSheetModal = "" | "action" | "delete";

export default function DepartmentsScreen() {
  const insets = useSafeAreaInsets();
  const [departments, setDepartments] = useState<IDepartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState<BottomSheetModal>("");
  const [selected, setSelected] = useState<IDepartment | null>(null);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải danh sách Khoa",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải danh sách Khoa",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const confirmDelete = async () => {
    if (!selected?.id) return;
    try {
      await deleteDepartment(selected.id);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đã xóa Khoa",
      });
      fetchDepartments();
    } catch {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể xóa Khoa" });
    } finally {
      setModal("");
      setSelected(null);
    }
  };

  const ACTION_OPTIONS = [
    {
      label: "Xem chi tiết",
      icon: Eye,
      color: "#18A957",
      bg: "#E8F8F0",
      onPress: () => {
        setModal("");
        if (selected?.id)
          router.push(`/(departments)/departments-detail/${selected.id}`);
      },
    },
    {
      label: "Chỉnh sửa",
      icon: Pencil,
      color: "#2667FF",
      bg: "#EFF4FF",
      onPress: () => {
        setModal("");
        if (selected?.id)
          router.push(`/(departments)/departments-edit/${selected.id}`);
      },
    },
    {
      label: "Xóa Khoa",
      icon: Trash2,
      color: "#E74C3C",
      bg: "#FFF0EE",
      onPress: () => {
        setModal("");
        setTimeout(() => setModal("delete"), 150);
      },
    },
  ];

  const renderItem = ({ item }: { item: IDepartment }) => (
    <Pressable
      onPress={() =>
        router.push(`/(departments)/departments-detail/${item.id}`)
      }
      className="mb-3 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-neutral-100"
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
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
          {item.code ? (
            <View className="flex-row items-center gap-1 mt-0.5">
              <Icon name={Hash} size={11} color="#A3A3A3" />
              <Text style={{ fontSize: 11, color: "#A3A3A3", lineHeight: 16 }}>
                {item.code}
              </Text>
            </View>
          ) : null}
          <View
            style={{
              marginTop: 6,
              alignSelf: "flex-start",
              borderRadius: 999,
              paddingHorizontal: 10,
              paddingVertical: 3,
              backgroundColor: item.isActive ? "#E8F8F0" : "#FDECEA",
            }}
          >
            <Text
              style={{
                fontSize: 11,
                lineHeight: 16,
                fontWeight: "600",
                color: item.isActive ? "#18A957" : "#E74C3C",
              }}
            >
              {item.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
            </Text>
          </View>
        </View>
      </View>
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

  return (
    <SafeAreaView
      className="flex-1 bg-brand-50"
      edges={["top", "left", "right"]}
    >
      <View
        className="flex-1 px-5 pb-28"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="mb-6 flex-row items-center justify-between">
          <Text variant="heading" className="text-brand-900">
            Khoa
          </Text>
          <Button
            size="sm"
            onPress={() => router.push("/(departments)/departments-create")}
            className="rounded-full bg-brand-500"
            icon={Plus}
          >
            Thêm mới
          </Button>
        </View>
        <FlatList
          data={departments}
          keyExtractor={(item, i) => item.id || String(i)}
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
                  <Icon name={Building2} size={32} color="#F47C20" />
                </View>
                <Text variant="title" className="text-center text-neutral-900">
                  Chưa có Khoa nào
                </Text>
                <Text
                  variant="caption"
                  className="mt-2 text-center text-neutral-500"
                >
                  Bấm "Thêm mới" để tạo Khoa đầu tiên
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
            {selected && (
              <View className="mb-4">
                <Text
                  variant="caption"
                  className="text-center text-neutral-500"
                >
                  Thao tác với
                </Text>
                <Text
                  variant="title"
                  className="text-center text-brand-900"
                  numberOfLines={1}
                >
                  {selected.name}
                </Text>
              </View>
            )}
            <View className="gap-3">
              {ACTION_OPTIONS.map((action, i) => (
                <Pressable
                  key={i}
                  onPress={action.onPress}
                  className="flex-row items-center gap-3 rounded-2xl p-4"
                  style={{ backgroundColor: action.bg }}
                >
                  <Icon name={action.icon} size={20} color={action.color} />
                  <Text
                    className="font-semibold"
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

      <DeleteDepartmentComponent
        visible={modal === "delete"}
        onClose={() => {
          setModal("");
          setSelected(null);
        }}
        onConfirm={confirmDelete}
        name={selected?.name}
      />
    </SafeAreaView>
  );
}
