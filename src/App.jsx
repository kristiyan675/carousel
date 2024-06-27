// src/App.js
import React, { useEffect, useState } from "react";
import ImageCarousel from "./components/Carousel";

const App = () => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch images from Picsum
    const fetchImages = async () => {
      const res = await fetch("https://picsum.photos/v2/list?page=1&limit=10");
      const data = await res.json();
      setImages(data.map((img) => img.download_url));
    };

    fetchImages();
  }, []);

  return (
    <div className="App">
      <h1>Our players’ favorite games</h1>
      <ImageCarousel images={images} />
    </div>
  );
};

export default App;
