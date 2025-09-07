import { router } from 'expo-router'
import { View, Text, Button } from 'react-native'
const signIn = () => {
  return (
    <View>
      <Text>signIn</Text>
      <Button title='Sign In' onPress={()=>router.push('/sign-up')} />
    </View>
  )
}
export default signIn