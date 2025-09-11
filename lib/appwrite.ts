import { CreateUserParams, GetMenuParams, SignInParams } from "@/type";
import { Account, Avatars, Client, ID, Query, TablesDB } from "react-native-appwrite";
//configuration coming from appwrite
const appwriteConfig = {
     endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
     projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
     platform: 'com.hashim.FryHub',
     databaseId:'68bdc43a00392a307ab0',
     bucketId:'68c1d38b00357d1b5f94',
        usersTableId:'user',
        categoriesTableId:'categories',
        menuTableId:'menu',
        customizationsTableId:'customizations',
        menuCustomizationsTableId:'menu_customizations'

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
export const storage = new Storage()

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
                tableId: appwriteConfig.usersTableId, 
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
            tableId: appwriteConfig.usersTableId,
            queries: [Query.equal("accountId", currentAccount.$id)],
    }
        )
        if(!currentUser) throw Error

        return currentUser.rows[0]
    } catch (e) {
        throw new Error(e as string)
    }
}

export const getMenu = async ({ category, query }:GetMenuParams)=>{
    try {
        const queries :string[] = [];
        //queries.push will append the value coming from Query.equal

        //Filter by category
        if(category) queries.push(Query.equal('categories', category));

        //search by name
        if(query) queries.push(Query.search('name', query));
        
        const menus = await tables.listRows({
                databaseId: appwriteConfig.databaseId,
                tableId: appwriteConfig.menuTableId,
                queries,
                });
    
        return menus.rows;
    
    } catch (e) {
        throw new Error(e as string)
    }
}
//to get categories
export const getCategories = async ()=>{
    try {
        const categories= await tables.listRows({
              databaseId: appwriteConfig.databaseId,
              tableId: appwriteConfig.categoriesTableId,
               
        });
       
    
    } catch (e) {
        throw new Error(e as string)
    }
}
export default appwriteConfig