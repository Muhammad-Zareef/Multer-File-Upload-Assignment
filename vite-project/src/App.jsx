import { useState, useRef } from 'react'
import auth from './firebase/config'
import { db } from './firebase/config';
import { collection, addDoc, Timestamp } from "firebase/firestore";
import './App.css'

function App() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null); // store the actual File object
  const [preview, setPreview] = useState(null);

  const resetInput = () => {
    setFile(null);
    fileRef.current.value = "";
  };
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed");
      setFile(null);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be under 2MB");
      setFile(null);
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:3000/upload/", {
      method: "POST",
      body: formData,
    });

      const data = await res.json();
      console.log(data);
      setPreview(data.imageUrl);
      setFile(null);
      resetInput();
      saveImage({imageUrl: data.imageUrl});
  }

  async function saveImage(imageUrl) {
        try {
            const docRef = await addDoc(collection(db, "images"), imageUrl);
            console.log("Image saved to Firestore");
        } catch (e) {
            console.error("Error adding document: ", e);
        }
    }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input ref={fileRef} type="file" name="image" accept="image/*" required onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      {preview && (
        <div>
          <h3>Preview</h3>
          <img src={preview} alt="uploaded" width="300" />
        </div>
      )}
    </>
  )
}

export default App
