import { useLocalSearchParams } from "expo-router";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useState } from "react";
import { OFFERS } from "@/constants";
import { useCartStore } from "@/store/cart.store";

export default function OfferDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { addItem } = useCartStore();
  const [quantity, setQuantity] = useState(1);

  const offer = OFFERS.find((o) => o.id.toString() === id);

  if (!offer) {
    return <Text>Offer not found</Text>;
  }

  const totalPrice = (offer.price ?? 0) * quantity;

  return (
    <View className="flex-1 bg-white p-5">
      {/* Image */}
      <Image source={offer.image} className="w-full h-64" resizeMode="contain" />

      {/* Title */}
      <Text className="h1-bold mt-4">{offer.title}</Text>
        {offer.calories && offer.protein && (
            <Text className="paragraph text-gray-500 mt-2">
                {offer.calories} cal • {offer.protein} protein
            </Text>
)}
      {/* Optional description if you add it in OFFERS */}
      {offer.description && (
        <Text className="paragraph text-gray-500 mt-2">
          {offer.description}
        </Text>
      )}

      {/* Quantity selector */}
      <View className="flex-row items-center justify-between mt-8">
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

        {/* Add to Cart */}
        <TouchableOpacity
          className="bg-primary px-6 py-3 rounded-2xl"
          onPress={() =>
            addItem({
              id: `${offer.id}-${Date.now()}`, // unique id for cart
              name: offer.title,
              price: offer.price ?? 0,
              image_url: Image.resolveAssetSource(offer.image).uri,
              customizations: [],
            })
          }
        >
          <Text className="h3-bold text-white">
            Add to Cart (${totalPrice})
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
