import { registerRootComponent } from "expo";
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, createContext } from 'react';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import theme from '@/constants/theme';
import {NavigationContainer} from '@react-navigation/native';
import AuthNav from '@/components/navigation/AuthNav'
import useUser from "./hooks/useUser";
import AdminNav from "./components/navigation/AdminNav";
import { useColorScheme } from '@/hooks/useColorScheme';
import MainComponent from '@/components/MainComponent'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const LoginContext = createContext();

function App() {
  const { user, setUser, getUser } = useUser()

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Poetsen: require('@/assets/fonts/PoetsenOne-Regular.ttf'),
  });

  const navRol = [
    {
      rol: 'admin',
      component: <AdminNav />,
    },
  ];

  useEffect(() => {
    const checkUser = async () => {
      await getUser();
    };

    checkUser();
  }, [user]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={DefaultTheme}>
      <PaperProvider theme={theme}>
        <MainComponent/>
      </PaperProvider>
    </ThemeProvider>
  );
}

registerRootComponent(App)