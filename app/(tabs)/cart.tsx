import { useCartStore } from '@/store/cart.store';
import { View, Text, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import CustomHeader from '@/components/CustomHeader';
import cn from 'clsx'
import CustomButton from '@/components/CustomButton';
import { PaymentInfoStripeProps } from '@/type';
import CartItem from '@/components/CartItem';

const PaymentInfoStripe = ({ label,  value,  labelStyle,  valueStyle, }: PaymentInfoStripeProps) => (
    <View className="flex-between flex-row my-1">
        <Text className={cn("paragraph-medium text-gray-200", labelStyle)}>
            {label}
        </Text>
        <Text className={cn("paragraph-bold text-dark-100", valueStyle)}>
            {value}
        </Text>
    </View>
);

const cart = () => {
  const {items, getTotalItems, getTotalPrice} = useCartStore();
  
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();
  return (
    <SafeAreaView className="bgwhite h-full">
      <FlatList
        data={items}
        renderItem ={({ item }) => <CartItem item={item}/>}
        keyExtractor={( item ) => item.id}
        contentContainerClassName="pb-28 px-5 pt-5"
        ListHeaderComponent={() => <CustomHeader title='Your Cart'/>}
        ListEmptyComponent={() => <Text>Cart Empty</Text>}
        ListFooterComponent={() => totalItems > 0 && (
          <View>
            <View className="mt-6 border border-gray-200 p-5 rounded-2xl">
              <Text className='h3-bold text-dark-100 mb-5'>
                Payment Summary
              </Text>
              <PaymentInfoStripe 
              label={`Total items(${totalItems})`}
              value={`$${totalPrice.toFixed(2)}`}
              />
               <PaymentInfoStripe 
              label={`Delivery Fee`}
              value={`$5.00`}
              />
               
               <PaymentInfoStripe 
              label={`Discount`}
              value={`-$0.50`}
              valueStyle="!text-sucess"
              />
                <View className="h-[1px] bg-gray-200 my-2"/>
                 <PaymentInfoStripe 
              label={`Total`}
              value={`$${(totalPrice  + 5 - 0.5).toFixed(2)}`}
              labelStyle="!text-dark-100"
              valueStyle="!text-dark-100"
              />
            </View>
            <CustomButton title='Order Now' />

          </View>
        )}

      />
    </SafeAreaView>
  )
}
export default cart