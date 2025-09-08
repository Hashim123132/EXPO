import { CreateUserParams, SignInParams } from "@/type";
import { Account, Avatars, Client, ID, Query, TablesDB } from "react-native-appwrite";
//configuration coming from appwrite
const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
     projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
     platform: 'com.hashim.FryHub',
     databaseId:'68bdc43a00392a307ab0',
     usersCollectionId:'user'
}
//using that configuration in client
export const client = new Client();
client
        .setEndpoint(appwriteConfig.endpoint)
        .setProject(appwriteConfig.projectId)
        .setPlatform(appwriteConfig.platform)
//using client as requirement to use Account instance
export const account = new Account(client)
export const tables = new TablesDB(client)
export const avatars = new Avatars(client)

//now creating user for signup
export const createUser = async({email, password, name}: CreateUserParams)=> {

    try {
        //user signs up with unique id and more
        const newAccount = await account.create({userId: ID.unique(), email, password, name,});        
        if (!newAccount) throw new Error("Account creation failed");
       
        // user will be automatically signed in
        await signIn({email, password})
        //users first two intials of his/her name to be displayed on avatar place
        const avatarUrl = avatars.getInitialsURL(name);
  
        //putting data in DB (table)
           return await tables.createRow({
                databaseId: appwriteConfig.databaseId,
                tableId: appwriteConfig.usersCollectionId, 
                rowId: ID.unique(),
                data: {
                    accountId: newAccount.$id,
                    email,
                    name,
                    avatar: avatarUrl,
                },
             });
            
    } catch (e) {
        throw new Error( e as string );
        
    }
}
export const signIn = async ({email, password}:SignInParams)=>{
    try {
    const session = await account.createEmailPasswordSession({email, password});
    }  catch (e) {
        throw new Error( e as string );
        
    }
}
//getting created user info for dashboard and the like
export const getCurrentUser = async()=>{
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;
        const currentUser = await tables.listRows(
            {
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.usersCollectionId,
            queries: [Query.equal("accountId", currentAccount.$id)],
    }
        )
        if(!currentUser) throw Error

        return currentUser.rows[0]
    } catch (e) {
        throw new Error(e as string)
    }
}
export default appwriteConfig