import CartButton from '@/components/CartButton';
import { getCategories, getMenu } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite'
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import cn from 'clsx'
import MenuCard from '@/components/MenuCard';
import { MenuItem } from '@/type';
import Filter from '@/components/Filter';
import SearchBar from '@/components/SearchBar';

const search = () => {
  //this grabs the category and query values from the route URL
  const {category, query} = useLocalSearchParams<{query: string; category:string}>()

  //using this special hook instead of multiple useEffect 
  
  //this hook will handle loading state and data fetching
  const {data, refetch, loading} = useAppwrite({
    fn: getMenu, params:{ category, query, limit:6, }
  });

  const {data: categories} = useAppwrite({fn: getCategories})

  //when user searches or filter by category we want to refetch the data
  //initially the data is empty 
  //this useEffect is for getMenu data to be refetched
  useEffect(() => {
    //if categrory and query are empty we still refetch but whole menu will be shown as these will act as constraints in getMenu function if no constraints whole menu will be shown
    refetch({category, query, limit: 6})
  
    
  }, [category, query])
  
  return (
 <SafeAreaView className="bg-white h-full">
   <FlatList
     data={data}
     renderItem={({ item, index }) => {
      //if its not even show normally else add margin top
       const isEven = index % 2 === 0;

       return (
         <View className={cn('flex-1 max-w-[48%]', !isEven ? 'mt-10' : 'mt-0')}>
           <MenuCard item ={item as MenuItem}/>
         </View>
       );
     }}
        keyExtractor={(item) => item.$id}
        numColumns={2}
        columnWrapperClassName="gap-7"
        contentContainerClassName="gap-7 px-5 pb-32"
        ListHeaderComponent={() => (
          <View className="my-5 gap-5">
            <View className="flex-start">
              <Text className="small bold uppercase text-primary">Search</Text>
              <View className="flex-start flex-row gap-x-1 mt-0.5">
                <Text className="paragraph-semibold text-dark-100">
                  Find your favorite food
                </Text>
              </View>
            </View>
            
            <CartButton />
            <SearchBar />
           <Filter categories={categories ?? []} />

          </View>
        )}
        ListEmptyComponent={() => !loading && <Text>No results</Text>}
      />
      </SafeAreaView>
      
  )
}
export default search