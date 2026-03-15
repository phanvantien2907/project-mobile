import { Building2, GraduationCap, School, TrendingUp } from "lucide-react-native";
import { Text, View } from "react-native";

const quickStats = [
  {
    label: "Sinh viên",
    value: "1,286",
    change: "+12%",
    icon: GraduationCap,
    bg: "bg-brand-50",
    iconBg: "bg-brand-500",
  },
  {
    label: "Lớp học",
    value: "48",
    change: "+3",
    icon: School,
    bg: "bg-[#FFF0E1]",
    iconBg: "bg-brand-400",
  },
  {
    label: "Phòng ban",
    value: "12",
    change: "Ổn định",
    icon: Building2,
    bg: "bg-[#FFE7D1]",
    iconBg: "bg-brand-600",
  },
  {
    label: "Điểm TB",
    value: "7.4",
    change: "+0.3",
    icon: TrendingUp,
    bg: "bg-brand-100",
    iconBg: "bg-brand-500",
  },
];

export default function QuickStartsComponent() {
    return (
       <View className="mb-5 gap-3">
                 <View className="flex-row gap-3">
                   {quickStats.slice(0, 2).map((s) => {
                     const Icon = s.icon;
                     return (
                       <View
                         key={s.label}
                         className={`flex-1 gap-3 rounded-2xl ${s.bg} p-4`}
                       >
                         <View
                           className={`h-9 w-9 items-center justify-center rounded-xl ${s.iconBg}`}
                         >
                           <Icon color="#FFFFFF" size={16} />
                         </View>
                         <View>
                           <Text className="text-xs font-medium text-brand-800">
                             {s.label}
                           </Text>
                           <View className="flex-row items-end gap-2">
                             <Text className="text-2xl font-extrabold text-brand-900">
                               {s.value}
                             </Text>
                             <Text className="mb-0.5 text-xs font-semibold text-brand-500">
                               {s.change}
                             </Text>
                           </View>
                         </View>
                       </View>
                     );
                   })}
                 </View>
                 <View className="flex-row gap-3">
                   {quickStats.slice(2).map((s) => {
                     const Icon = s.icon;
                     return (
                       <View
                         key={s.label}
                         className={`flex-1 gap-3 rounded-2xl ${s.bg} p-4`}
                       >
                         <View
                           className={`h-9 w-9 items-center justify-center rounded-xl ${s.iconBg}`}
                         >
                           <Icon color="#FFFFFF" size={16} />
                         </View>
                         <View>
                           <Text className="text-xs font-medium text-brand-800">
                             {s.label}
                           </Text>
                           <View className="flex-row items-end gap-2">
                             <Text className="text-2xl font-extrabold text-brand-900">
                               {s.value}
                             </Text>
                             <Text className="mb-0.5 text-xs font-semibold text-brand-500">
                               {s.change}
                             </Text>
                           </View>
                         </View>
                       </View>
                     );
                   })}
                 </View>
               </View>
    )
}