import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native'
import { CustomButtonProps } from '@/type'
import cn from 'clsx'

const CustomButton = ({
  onPress,
  title = 'Click Me',
  style,
  textStyle,
  leftIcon,
  isLoading = false
}:CustomButtonProps) => {
  return (
    <TouchableOpacity className={cn('custom-btn mt-7', style)} onPress={onPress}>
      {leftIcon}

        <View className='flex-center flex-row '>
          {isLoading ? (
            <ActivityIndicator size='small' color='white' />
          ) : (
            <Text className={cn('text-white paragraph-semibold', textStyle)}>
              {title}
            </Text>

          )
          }

        </View>

    </TouchableOpacity>
  )
}
export default CustomButton