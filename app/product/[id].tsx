import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, Image, FlatList, TouchableOpacity, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getRow, listRows } from "@/lib/appwrite";
import appwriteConfig from "@/lib/appwrite";
import { MenuItem } from "@/type";
import { useCartStore } from "@/store/cart.store";
import { Query } from "react-native-appwrite";

const ProductDetail = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [customizations, setCustomizations] = useState<any[]>([]);
  const [quantity, setQuantity] = useState(1);

  const { addItem } = useCartStore();

  useEffect(() => {
    if (!id) return;

    (async () => {
      // Fetch menu item
      const menuRes = await getRow<MenuItem>(appwriteConfig.menuTableId, id);
      setItem(menuRes);

      // Fetch all menu_customizations for this menu item
      const menuCustomRes = await listRows<any>(appwriteConfig.menuCustomizationsTableId, [
        Query.equal("menu", id),
      ]);

      // Extract linked customization documents
      const customizationDocs = menuCustomRes.map((mc) => mc.customizations);
      setCustomizations(customizationDocs);
    })();
  }, [id]);

  if (!item) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  const imageUrl = `${item.image_url}?project=${appwriteConfig.projectId}`;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerClassName="pb-32 px-5">
        <Image source={{ uri: imageUrl }} className="w-full h-60 mt-5" resizeMode="contain" />
        <Text className="h2-bold text-dark-100 mt-4">{item.name}</Text>
        <Text className="paragraph text-gray-500">{item.type}</Text>

        <View className="flex-row mt-4 gap-x-5">
          <Text className="h2-bold text-primary">${item.price}</Text>
          <Text className="paragraph text-gray-500">{item.calories} Cal</Text>
          <Text className="paragraph text-gray-500">{item.protein}g Protein</Text>
        </View>

        <Text className="paragraph mt-4 text-dark-100">{item.description}</Text>

        <Text className="h3-bold mt-6 mb-3 text-dark-100">Available Customizations</Text>
        <FlatList
          data={customizations}
          keyExtractor={(c) => c.$id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item: c }) => (
            <View className="items-center mr-5">
              <Image
                source={{ uri: `${c.image_url}?project=${appwriteConfig.projectId}` }}
                className="size-16 rounded-full"
                resizeMode="cover"
              />
              <Text className="paragraph mt-1">{c.name}</Text>
            </View>
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
            onPress={() =>
              addItem({ id: item.$id, name: item.name, price: item.price, image_url: imageUrl, customizations: [] })
            }
            className="bg-primary px-6 py-3 rounded-2xl"
          >
            <Text className="h3-bold text-white">Add to cart (${item.price * quantity})</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProductDetail;
