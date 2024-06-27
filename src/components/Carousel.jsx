import React, { useRef, useState, useEffect } from "react";
import Skeleton from "./Skeleton";
import "./Carousel.css";

const Carousel = () => {
  const containerRef = useRef(null);
  const innerContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const duplicatedImages = [...images, ...images];

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - innerContainerRef.current.offsetLeft);
    setScrollLeft(innerContainerRef.current.scrollLeft);
    containerRef.current.style.cursor = "grabbing";
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = x - startX;
    innerContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    containerRef.current.style.cursor = "grab";
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      containerRef.current.style.cursor = "grab";
    }
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      setIsDragging(false);
      if (containerRef.current) {
        containerRef.current.style.cursor = "grab";
      }
    };
    window.addEventListener("mouseup", handleMouseUpGlobal);
    return () => {
      window.removeEventListener("mouseup", handleMouseUpGlobal);
    };
  }, []);

  useEffect(() => {
    const scrollHandler = () => {
      const { scrollLeft, scrollWidth, clientWidth } =
        innerContainerRef.current;
      const maxScrollLeft = scrollWidth / 2;
      if (scrollLeft < clientWidth / 2) {
        innerContainerRef.current.scrollLeft += maxScrollLeft;
      } else if (scrollLeft >= maxScrollLeft + clientWidth / 2) {
        innerContainerRef.current.scrollLeft -= maxScrollLeft;
      }
    };

    if (innerContainerRef.current) {
      innerContainerRef.current.addEventListener("scroll", scrollHandler);

      return () => {
        innerContainerRef.current.removeEventListener("scroll", scrollHandler);
      };
    }
  }, [innerContainerRef.current]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await fetch("https://picsum.photos/v2/list?page=1&limit=10");
      const data = await res.json();
      const imageUrls = data.map((img) => img.download_url);

      // Load images
      const loadImages = imageUrls.map((url) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = resolve; // Resolve on error to prevent hanging
        });
      });

      await Promise.all(loadImages);
      setImages(imageUrls);
      setLoading(false);
    };

    fetchImages();
  }, []);

  useEffect(() => {
    if (!loading && innerContainerRef.current) {
      // Ensure the initial scroll position is correctly set once the images are loaded
      requestAnimationFrame(() => {
        innerContainerRef.current.scrollLeft =
          innerContainerRef.current.scrollWidth / 4;
      });
    }
  }, [loading, innerContainerRef.current]);

  return (
    <div
      className="container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="inner-container" ref={innerContainerRef}>
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} />
            ))
          : duplicatedImages.map((image, index) => (
              <div
                className="item"
                key={index}
                style={{ backgroundImage: `url(${image})` }}
                onMouseDown={handleMouseDown}
              ></div>
            ))}
      </div>
    </div>
  );
};

export default Carousel;
