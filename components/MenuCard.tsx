import appwriteConfig from '@/lib/appwrite'
import { useCartStore } from '@/store/cart.store'
import { MenuItem } from '@/type'
import {  Text, Image, TouchableOpacity, Platform } from 'react-native'
import { router } from 'expo-router';


const MenuCard = ({item: {$id, image_url, name, price }}: {item: MenuItem}) => {
  //product image
  const imageUrl = `${image_url}?project=${appwriteConfig.projectId}`;

  const {addItem} = useCartStore();  
  
  return ( 
    //whole food card
<TouchableOpacity
  className='menu-card'
  onPress={() =>
  router.push({
     pathname: '/product/[id]' as const, 

    params: { id: $id },
  })
}
  style={Platform.OS==='android' ? {elevation: 10, shadowColor:'#878787'} : {}}
>     
      <Image source={{uri: imageUrl }} className='size-32 absolute -top-10' resizeMode='contain' />
        <Text className='text-center base-bold text-dark-100 mb-2' numberOfLines={1}>{name}</Text>
        <Text className='body-regular text-gray-200 mb-4'>From ${price}</Text>
        
          <TouchableOpacity onPress={() => addItem({ id: $id, name, price, image_url: imageUrl, customizations: []})}>

            <Text className='paragraph-bold text-primary'>Add to cart</Text>
        </TouchableOpacity>
    </TouchableOpacity>
  )
}
export default MenuCard