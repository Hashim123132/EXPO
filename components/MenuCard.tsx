import appwriteConfig from '@/lib/appwrite'
import { useCartStore } from '@/store/cart.store'
import { MenuItem } from '@/type'
import { Text, Image, TouchableOpacity, Platform } from 'react-native'
import { router } from 'expo-router'
import burgerOne from '@/assets/images/burger-one.png'

const MenuCard = ({ item }: { item: MenuItem }) => {
  const { $id, image_url, name, price } = item
  const { addItem } = useCartStore()

  // Conditional image: Appwrite URL or local fallback
  const finalUri = image_url
    ? image_url.includes('storage.appwrite.io')
      ? `${image_url}?project=${appwriteConfig.projectId}`
      : image_url
    : Image.resolveAssetSource(burgerOne).uri

  return (
    <TouchableOpacity
      className="menu-card"
      onPress={() =>
        router.push({
          pathname: '/product/[id]' as const,
          params: { id: $id },
        })
      }
      style={Platform.OS === 'android' ? { elevation: 10, shadowColor: '#878787' } : {}}
    >
      <Image
        source={{ uri: finalUri }}
        className="size-32 absolute -top-10"
        resizeMode="contain"
      />

      <Text className="text-center base-bold text-dark-100 mb-2" numberOfLines={1}>
        {name}
      </Text>
      <Text className="body-regular text-gray-200 mb-4">From ${price}</Text>

      <TouchableOpacity
        onPress={() =>
          addItem({
            id: $id,
            name,
            price,
            image_url: finalUri,
            customizations: [],
          })
        }
      >
        <Text className="paragraph-bold text-primary">Add to cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  )
}

export default MenuCard
