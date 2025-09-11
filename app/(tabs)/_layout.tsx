
import { images } from '@/constants';
import useAuthStore from '@/store/auth.store';
import { Redirect, Slot, Tabs } from 'expo-router'
import { Image, Text, View } from 'react-native';
import cn from 'clsx';
export default function TabLayout() {

const TabBarIcon = ({focused, icon, title} : TabBarIconProps )=>{
  return(

    <View className='tab-icon'>
    <Image source={icon} className='size-7' resizeMode='contain' tintColor={focused ? '#FE8C00' : '#5D5F6D'} />
    <Text className={cn('text-sm font-bold', focused ? 'text-primary' : 'text-gray-200')}>
      {title}
    </Text>
  </View>
  )
}
const {isAuthenticated} = useAuthStore();


 if (!isAuthenticated) return <Redirect href="/sign-in" />;
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        
        tabBarStyle:{
          borderTopLeftRadius:50,
          borderTopRightRadius:50,
          borderBottomLeftRadius:50,
          marginHorizontal:20,
          height: 80,
          position:'absolute',
          bottom:40,
          backgroundColor:'white',
          shadowColor:'#1a1a1a',
          shadowOffset:{width:0, height:2},
          shadowOpacity:0.1,
          shadowRadius:4,
          elevation: 5
        }
      }}
    
    
    >
      <Tabs.Screen 
        name='index'
        options={{
          title:'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon title='Home' icon={images.home} foucsed={focused}/>
        }}
      />
       <Tabs.Screen 
        name='Search'
        options={{
          title:'Search',
          tabBarIcon: ({ focused }) => <TabBarIcon title='Search' icon={images.search} foucsed={focused}/>
        }}
      />
       <Tabs.Screen 
        name='Cart'
        options={{
          title:'Cart',
          tabBarIcon: ({ focused }) => <TabBarIcon title='Cart' icon={images.bag} foucsed={focused}/>
        }}
      />
       <Tabs.Screen 
        name='Profile'
        options={{
          title:'Profile',
          tabBarIcon: ({ focused }) => <TabBarIcon title='Profile' icon={images.person} foucsed={focused}/>
        }}
      />
    </Tabs>
  )

}