import { useColor } from '@/hooks/useColor';
import { FONT_SIZE } from '@/theme/globals';
import React, { forwardRef } from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';

type TextVariant =
  | 'body'
  | 'title'
  | 'subtitle'
  | 'caption'
  | 'heading'
  | 'link';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  lightColor?: string;
  darkColor?: string;
  children: React.ReactNode;
}

export const Text = forwardRef<RNText, TextProps>(
  (
    { variant = 'body', lightColor, darkColor, style, children, ...props },
    ref
  ) => {
    const textColor = useColor('text', { light: lightColor, dark: darkColor });
    const mutedColor = useColor('textMuted');

    const getTextStyle = (): TextStyle => {
      const baseStyle: TextStyle = {
        color: textColor,
      };

      switch (variant) {
        case 'heading':
          return {
            ...baseStyle,
            fontSize: 28,
            fontWeight: '800',
            lineHeight: 34,
          };
        case 'title':
          return {
            ...baseStyle,
            fontSize: 24,
            fontWeight: '700',
            lineHeight: 30,
          };
        case 'subtitle':
          return {
            ...baseStyle,
            fontSize: 19,
            fontWeight: '600',
            lineHeight: 26,
          };
        case 'caption':
          return {
            ...baseStyle,
            fontSize: FONT_SIZE,
            fontWeight: '400',
            lineHeight: 22,
            color: mutedColor,
          };
        case 'link':
          return {
            ...baseStyle,
            fontSize: FONT_SIZE,
            fontWeight: '500',
            lineHeight: 22,
            textDecorationLine: 'underline',
          };
        default: // 'body'
          return {
            ...baseStyle,
            fontSize: FONT_SIZE,
            fontWeight: '400',
            lineHeight: 24,
          };
      }
    };

    return (
      <RNText ref={ref} style={[getTextStyle(), style]} {...props}>
        {children}
      </RNText>
    );
  }
);
