import { Platform } from "react-native"

const appwriteConfig = {
    endpoint: process.env.EXPO_APPWRITE_ENDPOINT || 'http://localhost/v1',
     projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || '',
     Platform: 'com.hashim.FryHub',
     databaseId:'68bdc43a00392a307ab0',
     usersCollectionId:'user'
}
export default appwriteConfig