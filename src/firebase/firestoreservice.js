import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    query, 
    where, 
    orderBy, 
    serverTimestamp 
  } from 'firebase/firestore';
  import { db } from './config';
  
  // Generic CRUD operations
  export const createDocument = async (collectionName, data) => {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id };
    } catch (error) {
      return { error };
    }
  };
  
  export const getDocument = async (collectionName, docId) => {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { data: { id: docSnap.id, ...docSnap.data() } };
      } else {
        return { error: 'Document does not exist' };
      }
    } catch (error) {
      return { error };
    }
  };
  
  export const updateDocument = async (collectionName, docId, data) => {
    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { success: true };
    } catch (error) {
      return { error };
    }
  };
  
  export const deleteDocument = async (collectionName, docId) => {
    try {
      await deleteDoc(doc(db, collectionName, docId));
      return { success: true };
    } catch (error) {
      return { error };
    }
  };
  
  export const getCollection = async (collectionName, constraints = []) => {
    try {
      let q = collection(db, collectionName);
      
      if (constraints.length > 0) {
        q = query(q, ...constraints);
      }
      
      const querySnapshot = await getDocs(q);
      const documents = [];
      
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return { data: documents };
    } catch (error) {
      return { error };
    }
  };
  
  // Specific queries for the e-learning platform
  export const getSubjectsByTeacher = async (teacherId) => {
    return getCollection('subjects', [where('teacherId', '==', teacherId), orderBy('name')]);
  };
  
  export const getStudentSubscriptions = async (studentId) => {
    return getCollection('subscriptions', [where('studentId', '==', studentId), orderBy('createdAt', 'desc')]);
  };
  
  export const getAssignmentsBySubject = async (subjectId) => {
    return getCollection('assignments', [where('subjectId', '==', subjectId), orderBy('dueDate')]);
  };
  
  // Subject subscription functions
  export const createSubscription = async (studentId, subjects, amount, paymentMethod, paymentDetails) => {
    try {
      const subscriptionData = {
        studentId,
        subjects,
        amount,
        paymentMethod,
        paymentDetails,
        status: 'completed',
        createdAt: serverTimestamp()
      };
      
      const result = await createDocument('subscriptions', subscriptionData);
      
      // Also update the student's subjects array
      if (!result.error) {
        const userRef = doc(db, 'users', studentId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const currentSubjects = userData.subscribedSubjects || [];
          const newSubjects = [...new Set([...currentSubjects, ...subjects])];
          
          await updateDoc(userRef, {
            subscribedSubjects: newSubjects,
            updatedAt: serverTimestamp()
          });
        }
      }
      
      return result;
    } catch (error) {
      return { error };
    }
  };
  