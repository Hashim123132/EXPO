import { ID, Storage, TablesDB } from "react-native-appwrite";
import dummyData from "./data";
import appwriteConfig, { client } from "./appwrite";

interface Category {
  name: string;
  description: string;
}

interface Customization {
  name: string;
  price: number;
  type: "topping" | "side" | "size" | "crust" | string;
}

interface MenuItem {
  name: string;
  description: string;
  image_url: string;
  price: number;
  rating: number;
  calories: number;
  protein: number;
  category_name: string;
  customizations: string[];
}

interface DummyData {
  categories: Category[];
  customizations: Customization[];
  menu: MenuItem[];
}

const data = dummyData as DummyData;

const tables = new TablesDB(client);
const storage = new Storage(client);

async function clearAll(tableId: string): Promise<void> {
  const list = await tables.listRows({ databaseId: appwriteConfig.databaseId, tableId });
  await Promise.all(list.rows.map(row =>
    tables.deleteRow({ databaseId: appwriteConfig.databaseId, tableId, rowId: row.$id })
  ));
}

async function clearStorage(): Promise<void> {
  const list = await storage.listFiles({ bucketId: appwriteConfig.bucketId });
  await Promise.all(list.files.map(file =>
    storage.deleteFile({ bucketId: appwriteConfig.bucketId, fileId: file.$id })
  ));
}

async function uploadImageToStorage(imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();

    const fileObj: any = {
      name: imageUrl.split("/").pop() || `file-${Date.now()}.jpg`,
      type: blob.type,
      size: blob.size,
      uri: imageUrl,
    };

    const file = await storage.createFile({
      bucketId: appwriteConfig.bucketId,
      fileId: ID.unique(),
      file: fileObj,
    });

    return storage.getFileView({ bucketId: appwriteConfig.bucketId, fileId: file.$id });
  } catch (err) {
    console.error("Failed to upload image:", imageUrl, err);
    return null;
  }
}

async function seed(): Promise<void> {
  // Clear tables and storage
  await clearAll(appwriteConfig.categoriesTableId);
  await clearAll(appwriteConfig.customizationsTableId);
  await clearAll(appwriteConfig.menuTableId);
  await clearAll(appwriteConfig.menuCustomizationsTableId);
  await clearStorage();

  // 1. Categories
  const categoryMap: Record<string, string> = {};
  for (const cat of data.categories) {
    try {
      const row = await tables.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.categoriesTableId,
        rowId: ID.unique(),
        data: cat,
      });
      categoryMap[cat.name] = row.$id;
    } catch (err) {
      console.error("Failed to create category:", cat, err);
    }
  }

  // 2. Customizations
  const customizationMap: Record<string, string> = {};
  for (const cus of data.customizations) {
    try {
      const row = await tables.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.customizationsTableId,
        rowId: ID.unique(),
        data: cus,
      });
      customizationMap[cus.name] = row.$id;
    } catch (err) {
      console.error("Failed to create customization:", cus, err);
    }
  }

  // 3. Menu Items
  for (const item of data.menu) {
    try {
   let categoryId = categoryMap[item.category_name];
      if (!categoryId) {
        console.warn("Category not found for menu item, assigning N/A:", item.name);
        // create/find an N/A category
        if (!categoryMap["N/A"]) {
          const naRow = await tables.createRow({
            databaseId: appwriteConfig.databaseId,
            tableId: appwriteConfig.categoriesTableId,
            rowId: ID.unique(),
            data: { name: "N/A", description: "No category" },
          });
          categoryMap["N/A"] = naRow.$id;
        }
        categoryId = categoryMap["N/A"];
      }

      // Upload image (skip if fails)
      const placeholderImage = "https://www.vecteezy.com/vector-art/49426219-a-cartoon-style-illustration-of-a-delicious-pizza-slice-with-pepperoni-cheese-and-a-crispy-crust"; // any valid URL

    let uploadedImage: string = placeholderImage;
      try {
        const result = await uploadImageToStorage(item.image_url);
        if (result && typeof result === "string") {
          uploadedImage = result; // use URL string only
        }
      } catch (err) {
        console.warn("Image upload skipped for menu item:", item.name);
      }

      // Create menu row
      const row = await tables.createRow({
        databaseId: appwriteConfig.databaseId,
        tableId: appwriteConfig.menuTableId,
        rowId: ID.unique(),
        data: {
          name: item.name,
          description: item.description,
          image_url: uploadedImage, // always valid URL
          price: Math.round(item.price),
          rating: item.rating,
          calories: item.calories,
          protein: item.protein,
          categories: categoryId,
        },
      });
      // Menu customizations
      for (const cusName of item.customizations) {
        const cusId = customizationMap[cusName];
        if (!cusId) continue;

        await tables.createRow({
          databaseId: appwriteConfig.databaseId,
          tableId: appwriteConfig.menuCustomizationsTableId,
          rowId: ID.unique(),
          data: { menu: row.$id, customizations: cusId },
        });
      }
    } catch (err) {
      console.error("Failed to create menu item:", item.name, err);
    }
  }

  console.log("✅ Seeding complete (images skipped if failed).");
}

export default seed;
