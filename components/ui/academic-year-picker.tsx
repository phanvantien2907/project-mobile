import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  ViewStyle,
} from "react-native";
import { Calendar, ChevronDown, Check, X } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { useColor } from "@/hooks/useColor";
import { CORNERS, FONT_SIZE, HEIGHT } from "@/theme/globals";
import { LucideProps } from "lucide-react-native";

export interface AcademicYearPickerProps {
  value?: string | null;           // stored as "YYYY-YYYY", e.g. "2022-2026"
  onChange: (year: string) => void;
  placeholder?: string;
  icon?: React.ComponentType<LucideProps>;
  variant?: "filled" | "outline";
  disabled?: boolean;
  containerStyle?: ViewStyle;
  error?: string;
}

const CURRENT_YEAR = new Date().getFullYear();

// Each row height = paddingVertical(12) * 2 + lineHeight(20) = 44
const ITEM_HEIGHT = 44;

// Start years: currentYear+1 → 2010, newest first
const START_YEARS = Array.from(
  { length: CURRENT_YEAR + 2 - 2010 },
  (_, i) => CURRENT_YEAR + 1 - i
);

// End years: currentYear+8 → 2010, newest first
const END_YEARS = Array.from(
  { length: CURRENT_YEAR + 9 - 2010 },
  (_, i) => CURRENT_YEAR + 8 - i
);

function parseValue(value: string | null | undefined): { start: number; end: number } {
  const fallbackStart = CURRENT_YEAR;
  const fallbackEnd = CURRENT_YEAR + 4;
  if (!value) return { start: fallbackStart, end: fallbackEnd };
  const parts = value.split("-");
  const start = parseInt(parts[0], 10);
  const end = parseInt(parts[1], 10);
  return {
    start: isNaN(start) ? fallbackStart : start,
    end: isNaN(end) ? fallbackEnd : end,
  };
}

export function AcademicYearPicker({
  value,
  onChange,
  placeholder = "Chọn niên khóa",
  icon = Calendar,
  variant = "outline",
  disabled = false,
  containerStyle,
  error,
}: AcademicYearPickerProps) {
  const [open, setOpen] = useState(false);

  const parsed = parseValue(value);
  const [selectedStart, setSelectedStart] = useState<number>(parsed.start);
  const [selectedEnd, setSelectedEnd] = useState<number>(parsed.end);

  const cardColor = useColor("card");
  const muted = useColor("textMuted");
  const textColor = useColor("text");
  const borderColor = useColor("border");
  const primary = useColor("primary");
  const danger = useColor("red");
  const warning = useColor("yellow") ?? "#F59E0B";

  const containerBg = variant === "outline" ? "transparent" : cardColor;
  const borderC = error ? danger : open ? primary : borderColor;

  const displayLabel = value || null;
  const previewLabel = `${selectedStart} - ${selectedEnd}`;
  const selectedValue = `${selectedStart}-${selectedEnd}`;

  // warn if end < start
  const isInvalid = selectedEnd < selectedStart;

  const handleSelectStartYear = (year: number) => {
    setSelectedStart(year);
    setSelectedEnd(year + 4);
  };

  const handleSelectEndYear = (year: number) => {
    setSelectedEnd(year);
    setSelectedStart(year - 4);
  };

  const openPicker = () => {
    if (disabled) return;
    const p = parseValue(value);
    setSelectedStart(p.start);
    setSelectedEnd(p.end);
    setOpen(true);
  };

  const handleConfirm = () => {
    if (isInvalid) return;
    onChange(selectedValue);
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
            color: displayLabel ? textColor : muted,
          }}
          numberOfLines={1}
        >
          {displayLabel || placeholder}
        </Text>
        <Icon name={ChevronDown} size={16} color={muted} />
      </Pressable>

      {!!error && (
        <Text style={{ marginLeft: 14, marginTop: 4, fontSize: 13, color: danger }}>
          {error}
        </Text>
      )}

      {/* Picker Modal */}
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
                    Chọn niên khóa
                  </Text>
                </View>
                <Pressable onPress={handleClear} hitSlop={8}>
                  <Icon name={X} size={18} color={danger} />
                </Pressable>
              </View>

              {/* Preview */}
              <View
                style={{
                  alignItems: "center",
                  paddingVertical: 14,
                  backgroundColor: isInvalid ? danger + "12" : primary + "10",
                }}
              >
                <Text style={{ fontSize: 13, color: muted, marginBottom: 2 }}>
                  Niên khóa đã chọn
                </Text>
                <Text
                  style={{
                    fontSize: 26,
                    fontWeight: "800",
                    color: isInvalid ? danger : primary,
                  }}
                >
                  {previewLabel}
                </Text>
                {isInvalid ? (
                  <Text style={{ fontSize: 12, color: danger, marginTop: 2 }}>
                    ⚠ Năm ra phải lớn hơn hoặc bằng năm vào
                  </Text>
                ) : (
                  <Text style={{ fontSize: 12, color: muted, marginTop: 2 }}>
                    {`Vào ${selectedStart} · Ra ${selectedEnd} · ${selectedEnd - selectedStart} năm`}
                  </Text>
                )}
              </View>

              {/* Two scrollable columns */}
              <View
                style={{
                  flexDirection: "row",
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  gap: 12,
                }}
              >
                {/* START YEAR */}
                <YearColumn
                  label="NĂM VÀO"
                  years={START_YEARS}
                  selected={selectedStart}
                  onSelect={handleSelectStartYear}
                  primary={primary}
                  textColor={textColor}
                  borderColor={borderColor}
                  muted={muted}
                />

                {/* END YEAR */}
                <YearColumn
                  label="NĂM RA"
                  years={END_YEARS}
                  selected={selectedEnd}
                  onSelect={handleSelectEndYear}
                  primary={isInvalid ? danger : primary}
                  textColor={textColor}
                  borderColor={isInvalid ? danger + "60" : borderColor}
                  muted={muted}
                />
              </View>

              {/* Confirm */}
              <View style={{ paddingHorizontal: 20, paddingBottom: 36, paddingTop: 4 }}>
                <Button
                  onPress={handleConfirm}
                  disabled={isInvalid}
                  className="rounded-full bg-brand-500"
                  icon={Check}
                  // Fix: pass as string label so Button wraps it in <Text> properly
                  label={`Xác nhận  ${previewLabel}`}
                />
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── Reusable year column ──────────────────────────────────────────────────

interface YearColumnProps {
  label: string;
  years: number[];
  selected: number;
  onSelect: (y: number) => void;
  primary: string;
  textColor: string;
  borderColor: string;
  muted: string;
}

function YearColumn({
  label,
  years,
  selected,
  onSelect,
  primary,
  textColor,
  borderColor,
  muted,
}: YearColumnProps) {
  return (
    <View style={{ flex: 1 }}>
      {/* Column label */}
      <View
        style={{
          paddingVertical: 6,
          alignItems: "center",
          borderRadius: 10,
          backgroundColor: primary + "14",
          marginBottom: 6,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "700",
            color: primary,
            letterSpacing: 0.5,
          }}
        >
          {label}
        </Text>
      </View>

      {/* Scroll list */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        style={{
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          maxHeight: ITEM_HEIGHT * 5,
        }}
      >
        {years.map((year) => {
          const isSelected = year === selected;
          return (
            <Pressable
              key={year}
              onPress={() => onSelect(year)}
              style={{
                height: ITEM_HEIGHT,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: isSelected ? primary + "18" : "transparent",
                borderBottomWidth: 1,
                borderColor: borderColor + "40",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: isSelected ? "700" : "400",
                  color: isSelected ? primary : textColor,
                }}
              >
                {String(year)}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
