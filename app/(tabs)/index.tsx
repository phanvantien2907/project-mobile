import ActivityComponent from "@/components/ui/home-activity";
import FastManageComponent from "@/components/ui/home-fast-manage";
import HeroBannerComponent from "@/components/ui/home-hero-banner";
import QuickStartsComponent from "@/components/ui/home-quick-starts";
import RemindComponent from "@/components/ui/home-remind";
import { SafeAreaView, ScrollView, View, Text, Pressable, Alert } from "react-native";
import { LogOut } from "lucide-react-native";
import { logout } from "@/services/authen";
import { useRouter } from "expo-router";
import { useState } from "react";
import DialogLogout from "@/components/ui/dialog-logout";

export default function HomeScreen() {
  const router = useRouter();
  const [logoutState, setLogoutState] = useState({ visible: false, loading: false });

  const handleLogoutPress = () => setLogoutState({ visible: true, loading: false });
  const handleLogoutClose = () => setLogoutState(prev => ({ ...prev, visible: false }));

  const confirmLogout = async () => {
    setLogoutState(prev => ({ ...prev, loading: true }));
    try {
      await logout();
      router.replace("/(auth)/login" as any);
    } catch (error) {
      setLogoutState({ visible: false, loading: false });
      Alert.alert("Lỗi", "Không thể đăng xuất. Vui lòng thử lại!");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-50">
      <ScrollView
        className="flex-1"
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-28 pt-14">
        
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-sm font-medium text-brand-600 mb-1">Chào mừng quay lại 👋</Text>
            <Text className="font-bold text-3xl text-brand-900">Tổng quan</Text>
          </View>
          <Pressable 
            onPress={handleLogoutPress} 
            className="p-3 bg-white rounded-full border border-brand-200 active:opacity-70 shadow-sm"
          >
            <LogOut color="#F47C20" size={22} />
          </Pressable>
        </View>

        {/* Hero Banner */}
        <HeroBannerComponent />

        {/* Quick Stats 2x2 */}
        <QuickStartsComponent/>

        {/* Quản trị nhanh */}
        <FastManageComponent/>

        {/* Hoạt động gần đây */}
        <ActivityComponent/>

        {/* Nhắc nhở hôm nay */}
        <RemindComponent/>
      </ScrollView>

      <DialogLogout
        visible={logoutState.visible}
        isLoading={logoutState.loading}
        onClose={handleLogoutClose}
        onConfirm={confirmLogout}
      />
    </SafeAreaView>
  );
}