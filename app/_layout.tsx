//anything here will be consistent throughout the app

import { SplashScreen, Stack } from "expo-router";
import './globals.css'
import {useFonts} from "expo-font";
import { useEffect } from "react";
import * as Sentry from '@sentry/react-native';
import useAuthStore from "@/store/auth.store";
import Toast from "react-native-toast-message";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";

Sentry.init({
  dsn: 'https://e461219ac0da896d8fbcca4179ee2bb8@o4509969895391232.ingest.de.sentry.io/4509986195832912',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const RootLayoutComponent = () => {
  const { isLoading, fetchAuthenticatedUser } = useAuthStore();
  const router = useRouter();

  const [fontsLoaded, error] = useFonts({
    "Quicksand-Bold": require("../assets/fonts/Quicksand-Bold.ttf"),
    "Quicksand-Medium": require("../assets/fonts/Quicksand-Medium.ttf"),
    "Quicksand-Regular": require("../assets/fonts/Quicksand-Regular.ttf"),
    "Quicksand-SemiBold": require("../assets/fonts/Quicksand-SemiBold.ttf"),
    "Quicksand-Light": require("../assets/fonts/Quicksand-Light.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded, error]);

  useEffect(() => {
    fetchAuthenticatedUser();
  }, []);

  // Handle deep links (e.g., Stripe redirect)
  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      console.log("Deep link received:", url);
      const parsed = Linking.parse(url);
      const path = parsed.path;

      if (path === "success") {
        router.replace("/success");
      } else if (path === "cancel") {
        router.replace("/cancel");
      }
    });

    return () => subscription.remove();
  }, [router]);
if(!fontsLoaded || isLoading) return null;

  return (
    <>
  <Stack screenOptions={{headerShown: false}}/>
    <Toast />
    </>

);
};

 export default RootLayoutComponent;