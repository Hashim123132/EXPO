import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { images } from '@/constants'
import { Slot } from 'expo-router'
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, Dimensions, ImageBackground, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
const _layout = () => {
  return (
    <SafeAreaView>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView className='bg-white h-full' keyboardShouldPersistTaps='handled'>
          <View className='w-full relative ' style={{ height:Dimensions.get('screen').height/2.25 }}>
            <ImageBackground source={images.loginGraphic} className='size-full rounder-b-lg' resizeMode='stretch'/>
            <Image source={images.logo} className='self-center size-48 absolute -bottom-16 z-10'/>

          </View>
          
          <CustomInput
            placeholder='Enter your Email'
            value={''}
            onChangeText={() => {}}
            label='Email'
            keyboardType='email-address'
          
          />
          <CustomButton />
          
        
        <Slot />
        </ScrollView>
        
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
export default _layout