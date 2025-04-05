import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile,
    sendPasswordResetEmail,
    onAuthStateChanged
  } from 'firebase/auth';
  import { auth, db } from './config';
  import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
  
  // Register a new user
  export const registerUser = async (email, password, displayName, role) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email,
        displayName,
        role,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });
      
      return { user };
    } catch (error) {
      return { error };
    }
  };
  
  // Login user
  export const loginUser = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Update last login timestamp
      const userRef = doc(db, 'users', userCredential.user.uid);
      await setDoc(userRef, { lastLogin: serverTimestamp() }, { merge: true });
      
      return { user: userCredential.user };
    } catch (error) {
      return { error };
    }
  };
  
  // Logout user
  export const logoutUser = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { error };
    }
  };
  
  // Reset password
  export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { error };
    }
  };
  
  // Get current user data including Firestore profile
  export const getCurrentUserData = async () => {
    const user = auth.currentUser;
    
    if (!user) return null;
    
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        return { ...user, ...userDoc.data() };
      }
      return user;
    } catch (error) {
      console.error("Error getting user data:", error);
      return user;
    }
  };
  
  // Auth state observer
  export const onAuthStateChange = (callback) => {
    return onAuthStateChanged(auth, callback);
  };
  