// Function to upload file to MongoDB via API
export const uploadFileToMongo = async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  };
  
  // Function to get file URL
  export const getFileUrl = (filename) => {
    return `http://localhost:5000/api/files/${filename}`;
  };
  