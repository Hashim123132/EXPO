import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import appwriteConfig, { getRow, listRows } from "@/lib/appwrite";
import { useCartStore } from "@/store/cart.store";
import { CartCustomization, MenuItem } from "@/type";
import { Query } from "react-native-appwrite";

import coke from "@/assets/images/COCACOLA.jpg";
import avocado from "@/assets/images/avocado.png";
import burgerOne from "@/assets/images/burger-one.png";
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
import burgerTwo from "@/assets/images/burger-two.png";
import pizzaOne from "@/assets/images/pizza-one.png";

import Toast from "react-native-toast-message";

const localImagesByName: Record<string, any> = {
  "summer combo": burgerOne,
  "burger bash": burgerTwo,
  "pizza party": pizzaOne,
  "burrito delight": buritto,
  avocado,
  cheese,
  coleslaw,
  cucumber,
  fries,
  mozarellasticks: mozarellaSticks,
  mushrooms,
  onionrings: onionRings,
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
    const imageUri =
      Image.resolveAssetSource(
        localImagesByName[topping.name.toLowerCase().trim()] || avocado
      ).uri;

    addItem({
      id: `${topping.id}-${Date.now()}`,
      name: topping.name,
      price: topping.price,
      image_url: imageUri,
      customizations: [],
    });

    Toast.show({
      type: "success",
      text1: `${topping.name} added`,
      position: "top",
      visibilityTime: 2000,
    });
  };

  useEffect(() => {
    if (!id) return;

    (async () => {
      try {
        const menuRes = await getRow<MenuItem>(appwriteConfig.menuTableId, id);
        setItem(menuRes);

        const menuCustomRes = await listRows<any>(
          appwriteConfig.menuCustomizationsTableId,
          [Query.equal("menu", id)]
        );

        const customizationIds = menuCustomRes.map((mc) => mc.customizations);

        if (customizationIds.length > 0) {
          const customizationRes = await Promise.all(
            customizationIds.map((cid: string) =>
              getRow<CartCustomization>(appwriteConfig.customizationsTableId, cid)
            )
          );
          setCustomizations(customizationRes);
        }
      } catch (err) {
        console.error("Error fetching product or customizations:", err);
      }
    })();
  }, [id]);

  if (!item) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

const itemImage = item.image_url
  ? item.image_url.includes("storage.appwrite.io")
    ? { uri: `${item.image_url}?project=${appwriteConfig.projectId}` }
    : { uri: item.image_url }
  : localImagesByName[item.name.toLowerCase()] ;

  const totalPrice = item.price * quantity;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="pb-32 px-5">
        <Image
          source={itemImage}
          className="w-full h-60 mt-5"
          resizeMode="contain"
        />
        <Text className="h1-bold text-dark-100 mt-4">{item.name}</Text>
        <Text className="paragraph text-gray-500">{item.type}</Text>

        <View className="flex-row mt-4 gap-x-5">
          {/* <Text className="h2-bold text-primary">${item.price}</Text> */}
           {item.calories && item.protein ? (
            <Text className="paragraph text-gray-500">
              {item.calories} Cal • {item.protein}g Protein
            </Text>
          ) : item.calories ? (
            <Text className="paragraph text-gray-500">{item.calories} Cal</Text>
          ) : item.protein ? (
            <Text className="paragraph text-gray-500">{item.protein}g Protein</Text>
          ) : null}
        </View>

        <Text className="paragraph mt-4 text-dark-100">{item.description}</Text>

        {/* Show Extra Toppings only if available */}
        {customizations.length > 0 && (
          <>
            <Text className="h3-bold mt-6 mb-3 text-dark-100">
              Extra Toppings
            </Text>
            <FlatList
              data={customizations}
              keyExtractor={(c) => c.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item: c }) => (
                <TouchableOpacity
                  onPress={() => handleAddTopping(c)}
                  className="items-center mr-5 p-1 rounded-full"
                >
                  <Image
                    source={localImagesByName[c.name.toLowerCase().trim()] || avocado}
                    className="w-16 h-16 rounded-full"
                    resizeMode="cover"
                  />
                  <Text className="paragraph mt-1">{c.name}</Text>
                </TouchableOpacity>
              )}
            />
          </>
        )}

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
            <Text className="h3-bold text-white">(${totalPrice})</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;
