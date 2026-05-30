import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  View,
  ViewStyle,
} from "react-native";
import { ChevronDown, Check } from "lucide-react-native";
import { Text } from "@/components/ui/text";
import { Icon } from "@/components/ui/icon";
import { useColor } from "@/hooks/useColor";
import { CORNERS, FONT_SIZE, HEIGHT } from "@/theme/globals";
import { LucideProps } from "lucide-react-native";

export interface SelectOption<T = string> {
  label: string;
  value: T;
}

export interface SelectProps<T = string> {
  options: SelectOption<T>[];
  value?: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  icon?: React.ComponentType<LucideProps>;
  variant?: "filled" | "outline";
  disabled?: boolean;
  containerStyle?: ViewStyle;
  error?: string;
}

export function Select<T extends string = string>({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  icon,
  variant = "outline",
  disabled = false,
  containerStyle,
  error,
}: SelectProps<T>) {
  const [open, setOpen] = useState(false);

  const cardColor = useColor("card");
  const muted = useColor("textMuted");
  const textColor = useColor("text");
  const borderColor = useColor("border");
  const primary = useColor("primary");
  const danger = useColor("red");

  const selected = options.find((o) => o.value === value);

  const containerBg =
    variant === "outline" ? "transparent" : cardColor;
  const borderC = error ? danger : open ? primary : borderColor;

  return (
    <View style={containerStyle}>
      {/* Trigger */}
      <Pressable
        onPress={() => !disabled && setOpen(true)}
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
        {/* Left icon */}
        {icon && (
          <Icon name={icon} size={16} color={error ? danger : muted} />
        )}

        {/* Label */}
        <Text
          style={{
            flex: 1,
            fontSize: FONT_SIZE,
            color: selected ? textColor : muted,
          }}
          numberOfLines={1}
        >
          {selected ? selected.label : placeholder}
        </Text>

        {/* Chevron */}
        <Icon
          name={ChevronDown}
          size={16}
          color={muted}
          style={{
            transform: [{ rotate: open ? "180deg" : "0deg" }],
          }}
        />
      </Pressable>

      {/* Error */}
      {!!error && (
        <Text
          style={{
            marginLeft: 14,
            marginTop: 4,
            fontSize: 13,
            color: danger,
          }}
        >
          {error}
        </Text>
      )}

      {/* Dropdown modal */}
      <Modal visible={open} transparent animationType="fade">
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", padding: 24 }}
          onPress={() => setOpen(false)}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={{
              backgroundColor: cardColor,
              borderRadius: 20,
              overflow: "hidden",
              maxHeight: 360,
            }}
          >
            {/* Header */}
            <View
              style={{
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderColor: borderColor,
              }}
            >
              <Text variant="title" style={{ color: textColor }}>
                {placeholder}
              </Text>
            </View>

            {/* Options */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <Pressable
                    key={String(opt.value)}
                    onPress={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 20,
                      paddingVertical: 14,
                      borderBottomWidth: 1,
                      borderColor: borderColor + "60",
                      backgroundColor: isSelected ? primary + "12" : "transparent",
                      gap: 12,
                    }}
                  >
                    <Text
                      style={{
                        flex: 1,
                        fontSize: FONT_SIZE,
                        color: isSelected ? primary : textColor,
                        fontWeight: isSelected ? "600" : "400",
                      }}
                    >
                      {opt.label}
                    </Text>
                    {isSelected && (
                      <Icon name={Check} size={16} color={primary} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
