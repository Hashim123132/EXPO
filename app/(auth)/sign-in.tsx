import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { signIn } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { View, Text, Alert, ImageBackground } from 'react-native'
import * as Sentry from "@sentry/react-native";

const SignIn = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleSubmit = async () => {
    const { email, password } = form
    if (!email || !password) {
      return Alert.alert('Error', 'Please enter valid email address & password')
    }
    setIsSubmitting(true)
    try {
      await signIn({ email, password })
      router.replace('/')
    } catch (error: any) {
      Alert.alert('Error', error.message)
      Sentry.captureEvent(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <View className="flex-1 bg-white">
      {/* Background image with blur + overlay */}
      <ImageBackground
        source={require('@/assets/images/burger-background.png')}
        className="w-full h-64 justify-center"
        blurRadius={6}
      >
      <View className="absolute inset-0 bg-black/40" />
        <Text className="text-white text-2xl font-bold text-center px-5">
          Get started now
        </Text>
        <Text className='text-white text-xl text-center px-5'>Create an account or log in to explore</Text>
      </ImageBackground>

      {/* Sign-in form expanded */}
      <View className="flex-1 bg-white rounded-t-3xl p-5 mt-[-20] shadow-lg">
        <CustomInput
          placeholder="Enter your email"
          value={form.email}
          onChangeText={(text) => setForm((prev) => ({ ...prev, email: text }))}
          label="Email"
          keyboardType="email-address"
        />

        <CustomInput
          placeholder="Enter your password"
          value={form.password}
          onChangeText={(text) => setForm((prev) => ({ ...prev, password: text }))}
          label="Password"
          secureTextEntry={true}
        />

        <CustomButton
          title="Login"
          isLoading={isSubmitting}
          onPress={handleSubmit}
        />

        <View className="flex justify-center mt-5 flex-row gap-2">
          <Text className="base-regular text-gray-500">
            Don't have an account?
          </Text>
          <Link href="/sign-up" className="base-bold text-primary">
            Sign Up
          </Link>
        </View>
      </View>
    </View>
  )
}

export default SignIn
