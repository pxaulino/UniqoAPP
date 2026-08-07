import { Platform, ViewStyle } from 'react-native';

type ShadowOptions = {
  color?: string;
  offset?: { width: number; height: number };
  opacity?: number;
  radius?: number;
  elevation?: number;
};

function hexToRgba(color: string, opacity: number) {
  const normalized = color.replace('#', '');

  if (normalized.length === 3) {
    const [r, g, b] = normalized.split('').map((part) => parseInt(part + part, 16));
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  return color;
}

function toShadowColor(color: string, opacity: number) {
  if (color.startsWith('#')) return hexToRgba(color, opacity);
  if (color.startsWith('rgb(')) return color.replace('rgb(', 'rgba(').replace(')', `, ${opacity})`);
  return color;
}

export function platformShadow({
  color = '#000000',
  offset = { width: 0, height: 8 },
  opacity = 0.12,
  radius = 18,
  elevation = 6,
}: ShadowOptions = {}): ViewStyle {
  if (Platform.OS === 'web') {
    return {
      boxShadow: `${offset.width}px ${offset.height}px ${radius}px ${toShadowColor(color, opacity)}`,
    } as ViewStyle;
  }

  return {
    shadowColor: color,
    shadowOffset: offset,
    shadowOpacity: opacity,
    shadowRadius: radius,
    elevation,
  };
}
