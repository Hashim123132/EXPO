import { router } from 'expo-router'
import { View, Text, Button } from 'react-native'
const signUp = () => {
  return (
    <View>
      <Text>sign up</Text>
            <Button title='Sign Up' onPress={()=>router.push('/sign-in')} />
      
    </View>
  )
}
export default signUp