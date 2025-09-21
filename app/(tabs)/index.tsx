// Home Screen
import cn from "clsx";
import { router } from "expo-router";
import { Fragment } from "react";
import { FlatList, Image, Pressable, Text, TouchableOpacity, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CartButton from "@/components/CartButton";
import { images, OFFERS } from "@/constants";
import useAuthStore from "@/store/auth.store";
import appwriteConfig from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
import burgerOne from "@/assets/images/burger-one.png";

export default function Index() {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();

  const renderOfferCard = (item: any, isEven: boolean) => {
    // Determine final image URL (Appwrite URL or local fallback)
  const finalUri =
  item.image_url // only for Appwrite items
    ? item.image_url.includes("storage.appwrite.io")
      ? `${item.image_url}?project=${appwriteConfig.projectId}`
      : item.image_url
    : item.image // from OFFERS array
    ? Image.resolveAssetSource(item.image).uri
    : Image.resolveAssetSource(burgerOne).uri; // fallback

    return (
      <TouchableOpacity
        className={cn("offer-card", isEven ? "flex-row-reverse" : "flex-row")}
        style={{ backgroundColor: item.color, ...(Platform.OS === "android" ? { elevation: 10, shadowColor: "#878787" } : {}) }}
        onPress={() =>
        router.push({
          pathname: "/offer/[id]",
          params: { id: item.id.toString() }, 
        })
        }
      >
        <View className="h-full w-1/2">
          <Image source={{ uri: finalUri }} className="size-full" resizeMode="contain" />
        </View>

        <View className={cn("offer-card__info", isEven ? "pl-10" : "pr-10")}>
          <Text className="h1-bold text-white leading-tight">{item.title}</Text>
          <Image
            source={images.arrowRight}
            className="size-10"
            resizeMode="contain"
            tintColor="#ffffff"
          />
          <TouchableOpacity
            className="mt-3 bg-white px-4 py-2 rounded-lg"
            onPress={() =>
              addItem({
                id: item.id,
                name: item.title,
                price: item.price,
                image_url: finalUri,
                customizations: [],
              })
            }
          >
            <Text className="text-primary font-bold">Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-between flex-row w-full my-5 px-5">
        {/* Left - Deliver To */}
        <View className="flex-start">
          <Text className="small-bold text-primary">DELIVER TO</Text>
          <TouchableOpacity className="flex-center flex-row gap-x-1 mt-0.5">
            <Text className="paragraph-bold text-dark-100">Pakistan</Text>
            <Image source={images.arrowDown} className="size-3" resizeMode="contain" />
          </TouchableOpacity>
        </View>

        {/* Middle - Deals Button */}
        <TouchableOpacity
          onPress={() => router.push("/deals")}
          className="px-3 py-2 rounded-full bg-primary"
        >
          <Text className="text-white font-semibold">Deals</Text>
        </TouchableOpacity>

        {/* Right - Cart */}
        <CartButton />
      </View>

      <FlatList
      data={OFFERS}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => renderOfferCard(item, index % 2 === 0)}
      contentContainerClassName="pb-28 px-5"
    />
    </SafeAreaView>
  );
}
