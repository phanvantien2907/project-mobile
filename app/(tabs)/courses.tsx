import React, { useEffect, useState } from "react";
import { FlatList, Modal, Pressable, View, RefreshControl } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { BookOpen, Eye, Pencil, Plus, Trash2, MoreVertical, Award, Building2 } from "lucide-react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import DeleteCourse from "@/components/courses/delete";
import { deleteCourse, getCourses, ICourse, COURSE_TYPE_CONFIG, CourseType } from "@/services/courses";

type BottomSheetModal = "" | "action" | "delete";

export default function CoursesScreen() {
  const insets = useSafeAreaInsets();
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modal, setModal] = useState<BottomSheetModal>("");
  const [selected, setSelected] = useState<ICourse | null>(null);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể tải danh sách môn học" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể tải danh sách môn học" });
    } finally {
      setRefreshing(false);
    }
  };

  const confirmDelete = async () => {
    if (!selected?.id) return;
    try {
      await deleteCourse(selected.id);
      Toast.show({ type: "success", text1: "Thành công", text2: "Đã xóa môn học" });
      fetchCourses();
    } catch {
      Toast.show({ type: "error", text1: "Lỗi", text2: "Không thể xóa môn học" });
    } finally {
      setModal("");
      setSelected(null);
    }
  };

  const ACTION_OPTIONS = [
    {
      label: "Xem chi tiết", icon: Eye, color: "#18A957", bg: "#E8F8F0",
      onPress: () => { setModal(""); if (selected?.id) router.push(`/(courses)/courses-detail/${selected.id}`); },
    },
    {
      label: "Chỉnh sửa", icon: Pencil, color: "#2667FF", bg: "#EFF4FF",
      onPress: () => { setModal(""); if (selected?.id) router.push(`/(courses)/courses-edit/${selected.id}`); },
    },
    {
      label: "Xóa môn học", icon: Trash2, color: "#E74C3C", bg: "#FFF0EE",
      onPress: () => { setModal(""); setTimeout(() => setModal("delete"), 150); },
    },
  ];

  const renderItem = ({ item }: { item: ICourse }) => {
    const typeConfig = item.course_type
      ? COURSE_TYPE_CONFIG[item.course_type as CourseType]
      : null;

    return (
      <Pressable
        onPress={() => router.push(`/(courses)/courses-detail/${item.id}`)}
        className="mb-3 flex-row items-center justify-between rounded-2xl bg-white p-4 shadow-sm border border-neutral-100"
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        <View className="flex-1 flex-row items-center gap-3">
          <View className="h-10 w-10 items-center justify-center rounded-full bg-brand-50">
            <Icon name={BookOpen} size={20} color="#F47C20" />
          </View>
          <View className="flex-1">
            <Text variant="subtitle" className="text-neutral-900 font-semibold" numberOfLines={1}>
              {item.course_name}
            </Text>
            <View className="flex-row items-center gap-2 mt-0.5 flex-wrap">
              <Text style={{ fontSize: 11, color: "#A3A3A3", lineHeight: 16 }}>
                {item.course_code}
              </Text>
              {item.department_name ? (
                <View className="flex-row items-center gap-1">
                  <Icon name={Building2} size={11} color="#A3A3A3" />
                  <Text style={{ fontSize: 11, color: "#A3A3A3", lineHeight: 16 }} numberOfLines={1}>
                    {item.department_name}
                  </Text>
                </View>
              ) : null}
            </View>

            <View className="flex-row items-center gap-2 mt-1.5 flex-wrap">
              {/* Tín chỉ */}
              <View className="flex-row items-center gap-1">
                <Icon name={Award} size={11} color="#F0A500" />
                <Text style={{ fontSize: 11, color: "#F0A500", fontWeight: "600", lineHeight: 16 }}>
                  {item.course_credits} TC
                </Text>
              </View>
              {/* Loại môn */}
              {typeConfig ? (
                <View style={{ paddingHorizontal: 8, paddingVertical: 2, backgroundColor: typeConfig.bg, borderRadius: 999 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: typeConfig.text, lineHeight: 16 }}>
                    {typeConfig.label}
                  </Text>
                </View>
              ) : null}
              {/* Status */}
              <View style={{ paddingHorizontal: 8, paddingVertical: 2, backgroundColor: item.isActive ? "#E8F8F0" : "#FDECEA", borderRadius: 999 }}>
                <Text style={{ fontSize: 11, fontWeight: "600", color: item.isActive ? "#18A957" : "#E74C3C", lineHeight: 16 }}>
                  {item.isActive ? "Hoạt động" : "Dừng"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <Pressable
          onPress={(e) => { e.stopPropagation(); setSelected(item); setModal("action"); }}
          className="h-10 w-10 items-center justify-center rounded-full bg-neutral-100" hitSlop={8}
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
          <Text variant="heading" className="text-brand-900">Môn học</Text>
          <Button size="sm" onPress={() => router.push("/(courses)/courses-create")}
            className="rounded-full bg-brand-500" icon={Plus}>
            Thêm mới
          </Button>
        </View>
        <FlatList
          data={courses}
          keyExtractor={(item, i) => item.id || String(i)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#F47C20"]} />}
          ListEmptyComponent={
            !loading ? (
              <View className="mt-20 items-center justify-center">
                <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-brand-100">
                  <Icon name={BookOpen} size={32} color="#F47C20" />
                </View>
                <Text variant="title" className="text-center text-neutral-900">Chưa có môn học nào</Text>
                <Text variant="caption" className="mt-2 text-center text-neutral-500">
                  Bấm "Thêm mới" để tạo môn học đầu tiên
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      {/* Action Bottom Sheet */}
      <Modal visible={modal === "action"} transparent animationType="fade">
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setModal("")}>
          <Pressable className="rounded-t-3xl bg-white p-6"
            style={{ paddingBottom: Math.max(insets.bottom + 16, 24) }}
            onPress={(e) => e.stopPropagation()}>
            <View className="mb-4 items-center">
              <View className="h-1.5 w-12 rounded-full bg-neutral-200" />
            </View>
            {selected && (
              <View className="mb-4">
                <Text variant="caption" className="text-center text-neutral-500">Thao tác với</Text>
                <Text variant="title" className="text-center text-brand-900" numberOfLines={1}>{selected.course_name}</Text>
              </View>
            )}
            <View className="gap-3">
              {ACTION_OPTIONS.map((action, i) => (
                <Pressable key={i} onPress={action.onPress}
                  className="flex-row items-center gap-3 rounded-2xl p-4"
                  style={{ backgroundColor: action.bg }}>
                  <Icon name={action.icon} size={20} color={action.color} />
                  <Text className="font-semibold" style={{ color: action.color }}>{action.label}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <DeleteCourse
        visible={modal === "delete"}
        onClose={() => { setModal(""); setSelected(null); }}
        onConfirm={confirmDelete}
        name={selected?.course_name}
      />
    </SafeAreaView>
  );
}
