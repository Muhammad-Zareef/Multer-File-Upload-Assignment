import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [file, setFile] = useState(null); // store the actual File object
  const [preview, setPreview] = useState(null);
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    });

      const data = await res.json();
      console.log(data);
      setPreview(data.imageUrl);
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="file" name="image" accept="image/*" required onChange={(e) => setFile(e.target.files[0])} />
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
