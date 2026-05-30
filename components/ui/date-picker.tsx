import React, { useState, useMemo } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  ViewStyle,
} from "react-native";
import { Calendar, ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useColor } from "@/hooks/useColor";
import { CORNERS, FONT_SIZE, HEIGHT } from "@/theme/globals";
import { LucideProps } from "lucide-react-native";

export interface DatePickerProps {
  value?: string | null;           // stored as "DD/MM/YYYY"
  onChange: (date: string) => void;
  placeholder?: string;
  icon?: React.ComponentType<LucideProps>;
  variant?: "filled" | "outline";
  disabled?: boolean;
  containerStyle?: ViewStyle;
  error?: string;
}

const MONTHS = [
  "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4",
  "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
  "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 80 }, (_, i) => CURRENT_YEAR - i); // current → current-79

function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

function parseDateString(str: string): { day: number; month: number; year: number } | null {
  if (!str) return null;
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
  return { day: d, month: m, year: y };
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Chọn ngày sinh",
  icon = Calendar,
  variant = "outline",
  disabled = false,
  containerStyle,
  error,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const today = new Date();
  const parsed = value ? parseDateString(value) : null;

  const [selectedDay, setSelectedDay] = useState(parsed?.day ?? today.getDate());
  const [selectedMonth, setSelectedMonth] = useState(parsed?.month ?? today.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(parsed?.year ?? today.getFullYear() - 18);

  const cardColor = useColor("card");
  const muted = useColor("textMuted");
  const textColor = useColor("text");
  const borderColor = useColor("border");
  const primary = useColor("primary");
  const danger = useColor("red");

  const containerBg = variant === "outline" ? "transparent" : cardColor;
  const borderC = error ? danger : open ? primary : borderColor;

  const daysInMonth = useMemo(
    () => getDaysInMonth(selectedMonth, selectedYear),
    [selectedMonth, selectedYear],
  );

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Clamp day if month/year changes reduce days
  const clampedDay = Math.min(selectedDay, daysInMonth);

  const openPicker = () => {
    if (disabled) return;
    // Sync internal state with current value when opening
    if (parsed) {
      setSelectedDay(parsed.day);
      setSelectedMonth(parsed.month);
      setSelectedYear(parsed.year);
    }
    setOpen(true);
  };

  const handleConfirm = () => {
    const dd = String(clampedDay).padStart(2, "0");
    const mm = String(selectedMonth).padStart(2, "0");
    onChange(`${dd}/${mm}/${selectedYear}`);
    setOpen(false);
  };

  const handleClear = () => {
    onChange("");
    setOpen(false);
  };

  return (
    <View style={containerStyle}>
      {/* Trigger */}
      <Pressable
        onPress={openPicker}
        style={{
          flexDirection: "row",
          alignItems: "center",
          minHeight: HEIGHT,
          paddingHorizontal: 16,
          borderRadius: CORNERS,
          borderWidth: 1,
          borderColor: borderC,
          backgroundColor: disabled ? muted + "20" : containerBg,
          opacity: disabled ? 0.6 : 1,
          gap: 8,
        }}
      >
        <Icon name={icon} size={16} color={error ? danger : muted} />
        <Text
          style={{
            flex: 1,
            fontSize: FONT_SIZE,
            color: value ? textColor : muted,
          }}
          numberOfLines={1}
        >
          {value || placeholder}
        </Text>
        <Icon name={ChevronDown} size={16} color={muted} />
      </Pressable>

      {!!error && (
        <Text style={{ marginLeft: 14, marginTop: 4, fontSize: 13, color: danger }}>
          {error}
        </Text>
      )}

      {/* Date Picker Modal */}
      <Modal visible={open} transparent animationType="slide">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "flex-end" }}
          onPress={() => setOpen(false)}
        >
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View
              style={{
                backgroundColor: cardColor,
                borderTopLeftRadius: 28,
                borderTopRightRadius: 28,
                overflow: "hidden",
              }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                  paddingTop: 20,
                  paddingBottom: 12,
                  borderBottomWidth: 1,
                  borderColor: borderColor,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <Icon name={Calendar} size={18} color={primary} />
                  <Text style={{ fontSize: 17, fontWeight: "700", color: textColor }}>
                    Chọn ngày sinh
                  </Text>
                </View>
                <Pressable onPress={handleClear}>
                  <Text style={{ fontSize: 14, color: danger, fontWeight: "600" }}>Xóa</Text>
                </Pressable>
              </View>

              {/* Preview selected date */}
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 12,
                  backgroundColor: primary + "10",
                }}
              >
                <Text style={{ fontSize: 20, fontWeight: "800", color: primary, lineHeight: 28 }}>
                  {String(clampedDay).padStart(2, "0")} / {String(selectedMonth).padStart(2, "0")} / {selectedYear}
                </Text>
              </View>

              {/* Three Column Selectors */}
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  gap: 8,
                  maxHeight: 280,
                }}
              >
                {/* DAY */}
                <ColumnPicker
                  label="Ngày"
                  items={days.map((d) => ({ label: String(d).padStart(2, "0"), value: d }))}
                  selected={clampedDay}
                  onSelect={setSelectedDay}
                  primary={primary}
                  textColor={textColor}
                  muted={muted}
                  borderColor={borderColor}
                />

                {/* MONTH */}
                <ColumnPicker
                  label="Tháng"
                  items={MONTHS.map((m, i) => ({ label: m, value: i + 1 }))}
                  selected={selectedMonth}
                  onSelect={setSelectedMonth}
                  primary={primary}
                  textColor={textColor}
                  muted={muted}
                  borderColor={borderColor}
                />

                {/* YEAR */}
                <ColumnPicker
                  label="Năm"
                  items={YEARS.map((y) => ({ label: String(y), value: y }))}
                  selected={selectedYear}
                  onSelect={setSelectedYear}
                  primary={primary}
                  textColor={textColor}
                  muted={muted}
                  borderColor={borderColor}
                />
              </View>

              {/* Confirm */}
              <View style={{ paddingHorizontal: 20, paddingBottom: 36, paddingTop: 8 }}>
                <Button
                  onPress={handleConfirm}
                  className="rounded-full bg-brand-500"
                  icon={Check}
                >
                  Xác nhận
                </Button>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── Column Picker ──────────────────────────────────────────────────────────

interface ColumnItem {
  label: string;
  value: number;
}

interface ColumnPickerProps {
  label: string;
  items: ColumnItem[];
  selected: number;
  onSelect: (v: number) => void;
  primary: string;
  textColor: string;
  muted: string;
  borderColor: string;
}

function ColumnPicker({
  label,
  items,
  selected,
  onSelect,
  primary,
  textColor,
  muted,
  borderColor,
}: ColumnPickerProps) {
  return (
    <View style={{ flex: 1, borderRadius: 14, overflow: "hidden", borderWidth: 1, borderColor }}>
      {/* Column label */}
      <View
        style={{
          paddingVertical: 6,
          alignItems: "center",
          borderBottomWidth: 1,
          borderColor,
          backgroundColor: primary + "08",
        }}
      >
        <Text style={{ fontSize: 11, fontWeight: "700", color: primary, letterSpacing: 0.5 }}>
          {label.toUpperCase()}
        </Text>
      </View>

      {/* Scrollable list */}
      <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 200 }}>
        {items.map((item) => {
          const isSelected = item.value === selected;
          return (
            <Pressable
              key={item.value}
              onPress={() => onSelect(item.value)}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 8,
                alignItems: "center",
                backgroundColor: isSelected ? primary + "18" : "transparent",
                borderBottomWidth: 1,
                borderColor: borderColor + "50",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: isSelected ? "700" : "400",
                  color: isSelected ? primary : textColor,
                  lineHeight: 20,
                }}
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
