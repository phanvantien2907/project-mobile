import ActivityComponent from "@/components/ui/home-activity";
import FastManageComponent from "@/components/ui/home-fast-manage";
import HeroBannerComponent from "@/components/ui/home-hero-banner";
import QuickStartsComponent from "@/components/ui/home-quick-starts";
import RemindComponent from "@/components/ui/home-remind";
import {SafeAreaView, ScrollView } from "react-native";


export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-brand-50">
      <ScrollView
        className="flex-1"
        bounces={false}
        showsVerticalScrollIndicator={false}
        contentContainerClassName="px-5 pb-28 pt-14"
      >
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
    </SafeAreaView>
  );
}