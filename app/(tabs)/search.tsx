import CartButton from '@/components/CartButton';
import { getCategories, getMenu } from '@/lib/appwrite';
import useAppwrite from '@/lib/useAppwrite'
import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, FlatList, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import cn from 'clsx'
import MenuCard from '@/components/MenuCard';
import Filter from '@/components/Filter';
import SearchBar from '@/components/SearchBar';

const Search = () => {
  const { category = '', query = '' } = useLocalSearchParams<{query: string; category: string}>();

  // custom hook for fetching data
  const { data, refetch, loading } = useAppwrite({
    fn: getMenu,
    params: { category, query }
  });

  const { data: categories } = useAppwrite({ fn: getCategories });

  useEffect(() => {
    refetch({ category, query })
  }, [category, query]);

  return (
    <SafeAreaView className="bg-white h-full">
      <FlatList
        data={data}
        renderItem={({ item, index }) => {
          const isEven = index % 2 === 0;
          return (
            <View className={cn('flex-1 max-w-[48%]', !isEven ? 'mt-10' : 'mt-0')}>
              <MenuCard item={item} />
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
              <Text className="small-bold uppercase text-primary">Search</Text>
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
        ListEmptyComponent={() =>
          !loading && (
            <View className="flex-1 justify-center items-center mt-20 px-5">
              <Image
                source={require('@/assets/images/empty-state.png')}
                className="w-40 h-40 mb-5"
                resizeMode="contain"
              />
              <Text className="heading3 text-dark-100 text-center">
                Nothing matched your search
              </Text>
              <Text className="paragraph text-dark-50 text-center mt-2">
                Try a different search term or check for typos.
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Search;
