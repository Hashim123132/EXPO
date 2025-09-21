import appwriteConfig from './appwrite';

export const getImageUri = (url: string | undefined) => {
  if (!url) return undefined;

  const trimmed = url.trim();

  // If Appwrite bucket URL
  if (trimmed.includes('storage.appwrite.io')) {
    return `${encodeURI(trimmed)}?project=${appwriteConfig.projectId}`;
  }

  // External URL
  return trimmed;
};
