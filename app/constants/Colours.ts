/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#1E90FF'; // Lighter blue
const tintColorDark = '#ADD8E6'; // Light blue for dark mode

export const Colors = {
  light: {
    text: '#1C2833',
    secondaryText: '#5D6D7E',
    background: '#E3F2FD',
    primary: "#BBDEFB", 
    secondary: "#90CAF9",
    tint: tintColorLight,
    icon: '#5D6D7E',
    tabIconDefault: '#5D6D7E',
    tabIconSelected: tintColorLight,
    transparent: '#00000000',
  },
  dark: {
    text: '#D5DBDB',
    secondaryText: '#AAB7B8',
    background: '#0F1B24',
    primary: "#0F1B24",
    secondary: "#1C2833",
    tint: tintColorDark,
    icon: '#AAB7B8',
    tabIconDefault: '#AAB7B8',
    tabIconSelected: tintColorDark,
    transparent: '#00000000',
  },
};