import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getRow, listRows } from "@/lib/appwrite";
import appwriteConfig from "@/lib/appwrite";
import { MenuItem, CartCustomization } from "@/type";
import { useCartStore } from "@/store/cart.store";
import { Query } from "react-native-appwrite";

import avocado from "@/assets/images/avocado.png";
import buritto from "@/assets/images/buritto.png";
import cheese from "@/assets/images/cheese.png";
import coleslaw from "@/assets/images/coleslaw.png";
import cucumber from "@/assets/images/cucumber.png";
import fries from "@/assets/images/fries.png";
import mozarellaSticks from "@/assets/images/mozarella-sticks.png";
import mushrooms from "@/assets/images/mushrooms.png";
import onionRings from "@/assets/images/onion-rings.png";
import onions from "@/assets/images/onions.png";
import salad from "@/assets/images/salad.png";
import tomatoes from "@/assets/images/tomatoes.png";
import coke from "@/assets/images/COCACOLA.jpg";

import Toast from "react-native-toast-message";

const localImages: Record<string, any> = {
  avocado,
  buritto,
  cheese,
  coleslaw,
  cucumber,
  fries,
  mozarellaSticks,
  mushrooms,
  onionRings,
  onions,
  salad,
  tomatoes,
  coke,
};

const ProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [customizations, setCustomizations] = useState<CartCustomization[]>([]);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCartStore();

    const handleAddTopping = (topping: CartCustomization) => {
      addItem({
        id: `${topping.id}-${Date.now()}`,
        name: topping.name,
        price: topping.price,
        image_url: Image.resolveAssetSource(
          localImages[topping.name.toLowerCase().trim()] || avocado
        ).uri, 
        customizations: [],
      });
    };
  useEffect(() => {
    if (!id) return;

    (async () => {
      const menuRes = await getRow<MenuItem>(appwriteConfig.menuTableId, id);
      setItem(menuRes);

      const menuCustomRes = await listRows<any>(
        appwriteConfig.menuCustomizationsTableId,
        [Query.equal("menu", id)]
      );

      const customizationIds = menuCustomRes.map((mc) => mc.customizations);

      const customizationRes = await Promise.all(
        customizationIds.map((cid: string) =>
          getRow<CartCustomization>(appwriteConfig.customizationsTableId, cid)
        )
      );

      setCustomizations(customizationRes);
    })();
  }, [id]);

  if (!item) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const itemImage = item.image_url ? { uri: item.image_url } : avocado;

  const totalPrice = item.price * quantity;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="pb-32 px-5">
        <Image
          source={itemImage}
          className="w-full h-60 mt-5"
          resizeMode="contain"
        />
        <Text className="h2-bold text-dark-100 mt-4">{item.name}</Text>
        <Text className="paragraph text-gray-500">{item.type}</Text>

        <View className="flex-row mt-4 gap-x-5">
          <Text className="h2-bold text-primary">${item.price}</Text>
          <Text className="paragraph text-gray-500">{item.calories} Cal</Text>
          <Text className="paragraph text-gray-500">{item.protein}g Protein</Text>
        </View>

        <Text className="paragraph mt-4 text-dark-100">{item.description}</Text>

        <Text className="h3-bold mt-6 mb-3 text-dark-100">Extra Toppings</Text>

       <FlatList
          data={customizations}
          keyExtractor={(c) => c.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: c }) => (
            <TouchableOpacity
              onPress={() => {
                handleAddTopping(c);
                Toast.show({
                  type: "success",
                  text1: `${c.name} added`,
                  text2: `Added on top of ${item.name}`,
                  position: "top",
                  visibilityTime: 2000,
                });
              }}
              className="items-center mr-5 p-1 rounded-full"
            >
              <Image
                source={localImages[c.name.toLowerCase().trim()] || avocado}
                className="w-16 h-16 rounded-full"
                resizeMode="cover"
              />
              <Text className="paragraph mt-1">{c.name}</Text>
            </TouchableOpacity>
          )}
        />


        <View className="flex-row justify-between items-center mt-10">
          <View className="flex-row items-center gap-x-4">
            <TouchableOpacity
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
              className="bg-gray-200 px-3 py-1 rounded-lg"
            >
              <Text className="h3-bold">-</Text>
            </TouchableOpacity>
            <Text className="h3-bold">{quantity}</Text>
            <TouchableOpacity
              onPress={() => setQuantity((q) => q + 1)}
              className="bg-gray-200 px-3 py-1 rounded-lg"
            >
              <Text className="h3-bold">+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => {
              addItem({
                id: item.$id,
                name: item.name,
                price: item.price,
                image_url: item.image_url,
                customizations: [],
              });

              Toast.show({
                type: "success",
                text1: "Added to cart",
                text2: `${item.name} added successfully.`,
                position: "top",
                visibilityTime: 3000,
              });
            }}
            className="bg-primary px-6 py-3 rounded-2xl"
          >
            <Text className="h3-bold text-white">
              Add to cart (${totalPrice})
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;
