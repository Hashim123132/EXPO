import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Deals() {
  return (
    <SafeAreaView className="flex-1 bg-white items-center justify-center">
      <Text className="text-2xl font-bold text-primary">Deals Page</Text>
      <Text className="text-gray-500 mt-2">Show your special s here</Text>
    </SafeAreaView>
  );
}
