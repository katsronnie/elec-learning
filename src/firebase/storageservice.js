import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

// Upload a file to Firebase Storage
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return { url: downloadURL, path };
  } catch (error) {
    return { error };
  }
};

// Delete a file from Firebase Storage
export const deleteFile = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
    
    return { success: true };
  } catch (error) {
    return { error };
  }
};

// Upload a subject material (document, video, etc.)
export const uploadSubjectMaterial = async (file, subjectId, type) => {
  const fileExtension = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExtension}`;
  const path = `subjects/${subjectId}/${type}/${fileName}`;
  
  return uploadFile(file, path);
};

// Upload a profile picture
export const uploadProfilePicture = async (file, userId) => {
  const fileExtension = file.name.split('.').pop();
  const fileName = `profile.${fileExtension}`;
  const path = `users/${userId}/${fileName}`;
  
  return uploadFile(file, path);
};
