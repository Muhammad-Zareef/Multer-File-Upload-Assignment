import { useState, useRef, useEffect } from 'react'
import { db } from './firebase/config';
import { collection, addDoc, getDocs } from "firebase/firestore";
import './App.css'

function App() {
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);

  async function getData() {
    try {
      const querySnapshot = await getDocs(collection(db, "images"));
      const imageList = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.imageUrl) {
          imageList.push({
            id: doc.id,
            imageUrl: data.imageUrl,
          });
        }
      });
      setImages(imageList);
      console.log("Images fetched from Firestore:", imageList);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  }

  useEffect(() => {
    getData();
  }, []);

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
      setFile(null);
      resetInput();
      saveImage({imageUrl: data.imageUrl});
  }

  async function saveImage(imageUrl) {
    try {
      const docRef = await addDoc(collection(db, "images"), imageUrl);
      console.log("Image saved to Firestore");
      getData();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input ref={fileRef} type="file" name="image" accept="image/*" required onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Upload</button>
      </form>
      {images.length === 0 && <p>No images found</p>}
      {images.map((item) => (
        <div key={item.id}>
          <img
            src={item.imageUrl}
            alt="uploaded"
            width="300"
            style={{ marginBottom: "10px" }}
          />
        </div>
      ))}
    </>
  )
}

export default App
