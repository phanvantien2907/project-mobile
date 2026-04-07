import ActivityComponent from "@/components/ui/home-activity";
import FastManageComponent from "@/components/ui/home-fast-manage";
import HeroBannerComponent from "@/components/ui/home-hero-banner";
import QuickStartsComponent from "@/components/ui/home-quick-starts";
import RemindComponent from "@/components/ui/home-remind";
import { SafeAreaView, ScrollView, Alert } from "react-native";
import { logout } from "@/services/authen";
import { useRouter } from "expo-router";
import { useState } from "react";
import DialogLogout from "@/components/ui/dialog-logout";
import HeaderComponent from "@/components/ui/header";

export default function HomeScreen() {
  const [logoutState, setLogoutState] = useState({
    visible: false,
    loading: false,
  });
  const router = useRouter();

  const handleLogoutPress = () =>
    setLogoutState({ visible: true, loading: false });

  const handleLogoutClose = () =>
    setLogoutState((prev) => ({ ...prev, visible: false }));

  const confirmLogout = async () => {
    setLogoutState((prev) => ({ ...prev, loading: true }));
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
        <HeaderComponent onLogoutPress={handleLogoutPress} />

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