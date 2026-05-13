import { Platform, Text, TextInput } from 'react-native';

export const FONT_FAMILY = Platform.select({
  ios: 'SF Pro Display',
  android: 'sans-serif',
  web: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Segoe UI", Arial, sans-serif',
  default: 'System',
});

export const TYPOGRAPHY = {
  heroTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  screenTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  sectionTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  cardTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  body: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '400' as const,
    letterSpacing: 0,
  },
  bodyMedium: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '500' as const,
    letterSpacing: 0,
  },
  label: {
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '500' as const,
    letterSpacing: 0,
  },
  labelSemibold: {
    fontFamily: FONT_FAMILY,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  stat: {
    fontFamily: FONT_FAMILY,
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '700' as const,
    letterSpacing: 0,
  },
  button: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600' as const,
    letterSpacing: 0,
  },
  tab: {
    fontFamily: FONT_FAMILY,
    fontSize: 11,
    lineHeight: 14,
    fontWeight: '500' as const,
    letterSpacing: 0,
  },
};

export function configureTypography() {
  const baseText = {
    fontFamily: FONT_FAMILY,
    fontWeight: '400',
    letterSpacing: 0,
    includeFontPadding: false,
  };

  const text = Text as typeof Text & { defaultProps?: Record<string, unknown> };
  const textInput = TextInput as typeof TextInput & { defaultProps?: Record<string, unknown> };

  text.defaultProps = text.defaultProps ?? {};
  text.defaultProps.style = [baseText, text.defaultProps.style];
  text.defaultProps.maxFontSizeMultiplier = 1.2;

  textInput.defaultProps = textInput.defaultProps ?? {};
  textInput.defaultProps.style = [baseText, textInput.defaultProps.style];
  textInput.defaultProps.maxFontSizeMultiplier = 1.2;
}
