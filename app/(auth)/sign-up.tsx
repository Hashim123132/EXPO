import CustomButton from '@/components/CustomButton'
import CustomInput from '@/components/CustomInput'
import { createUser } from '@/lib/appwrite'
import { Link, router } from 'expo-router'
import { useState } from 'react'
import { View, Text, Alert, ImageBackground } from 'react-native'

const SignUp = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleSubmit = async () => {
    const { name, email, password } = form
    if (!name || !email || !password) {
      return Alert.alert('Error', 'Please enter valid name, email & password')
    }
    setIsSubmitting(true)
    try {
      // made this createUser function in appwrite it creates user
      await createUser({ email, password, name })
      router.replace('/')
    } catch (error: any) {
      Alert.alert('Error', error.message)
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
          Join us today
        </Text>
        <Text className="text-white text-xl text-center px-5">
          Create an account to start exploring
        </Text>
      </ImageBackground>

      {/* Sign-up form expanded */}
      <View className="flex-1 bg-white rounded-t-3xl p-5 mt-[-20] shadow-lg">
        <CustomInput
          placeholder="Enter your full name"
          value={form.name}
          onChangeText={(text) => setForm((prev) => ({ ...prev, name: text }))}
          label="Full Name"
        />

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
          title="Sign Up"
          isLoading={isSubmitting}
          onPress={handleSubmit}
        />

        <View className="flex justify-center mt-5 flex-row gap-2">
          <Text className="base-regular text-gray-500">
            Already have an account?
          </Text>
          <Link href="/sign-in" className="base-bold text-primary">
            Sign In
          </Link>
        </View>
      </View>
    </View>
  )
}

export default SignUp
