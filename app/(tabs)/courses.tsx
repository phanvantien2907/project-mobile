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
  Building2,
  Pencil,
  Plus,
  Trash2,
  MoreVertical,
} from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import CreateCourse from "@/components/courses/create";
import UpdateCourse from "@/components/courses/update";
import DetailCourse from "@/components/courses/detail";
import DeleteCourse from "@/components/courses/delete";
import { deleteCourse, getCourses, ICourse } from "@/services/courses";

export default function CoursesScreen() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Unified modal state
  const [modal, setModal] = useState<
    "" | "create" | "update" | "detail" | "delete" | "action"
  >("");
  const [selected, setSelected] = useState<ICourse | null>(null);

  const fetchCourses = useCallback(async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể tải danh sách khóa học",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchCourses();
    }, [fetchCourses]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCourses();
  }, [fetchCourses]);

  const confirmDelete = async () => {
    if (!selected?.id) return;
    try {
      await deleteCourse(selected.id);
      Toast.show({
        type: "success",
        text1: "Thành công",
        text2: "Đã xóa khóa học",
      });
      fetchCourses();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Không thể xóa khóa học",
      });
    } finally {
      setModal("");
      setSelected(null);
    }
  };

  const ACTION_OPTIONS = [
    {
      label: "Xem chi tiết",
      icon: Building2,
      key: "detail",
      color: "#18A957",
      bg: "#E8F8F0",
    },
    {
      label: "Chỉnh sửa",
      icon: Pencil,
      key: "update",
      color: "#2667FF",
      bg: "#EFF4FF",
    },
    {
      label: "Xóa khóa học",
      icon: Trash2,
      key: "delete",
      color: "#E74C3C",
      bg: "#FFF0EE",
    },
  ] as const;

  const renderItem = ({ item }: { item: ICourse }) => (
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
            {item.course_name}
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
            Khóa học
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
          data={courses}
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
                  <Icon name={Building2} size={32} color="#F47C20" />
                </View>
                <Text variant="title" className="text-center text-neutral-900">
                  Chưa có khóa học nào
                </Text>
                <Text
                  variant="caption"
                  className="mt-2 text-center text-neutral-500"
                >
                  Bấm "Thêm mới" để tạo khóa học đầu tiên
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
              {ACTION_OPTIONS.map((action) => (
                <Pressable
                  key={action.key}
                  onPress={() => {
                    setModal("");
                    setTimeout(() => setModal(action.key), 150);
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

      <CreateCourse
        visible={modal === "create"}
        onClose={() => setModal("")}
        onSuccess={fetchCourses}
      />
      <DetailCourse
        visible={modal === "detail"}
        onClose={() => setModal("")}
        course={selected}
      />
      <UpdateCourse
        visible={modal === "update"}
        onClose={() => setModal("")}
        onSuccess={fetchCourses}
        initialData={selected}
      />
      <DeleteCourse
        visible={modal === "delete"}
        onClose={() => setModal("")}
        onConfirm={confirmDelete}
        name={selected?.course_name}
      />
    </SafeAreaView>
  );
}
