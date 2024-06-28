import { useRef, useState, useEffect } from "react";

const useCarousel = (fetchUrl, imageCount) => {
  const containerRef = useRef(null);
  const innerContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);

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
    const fetchImages = async () => {
      const res = await fetch(fetchUrl);
      const data = await res.json();
      const imageUrls = data
        .slice(0, imageCount)
        .map((img) => img.download_url);
      preloadImages(imageUrls);
    };

    const preloadImages = (imageUrls) => {
      const promises = imageUrls.map((url) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = url;
          img.onload = () => resolve(url);
          img.onerror = reject;
        });
      });

      Promise.all(promises)
        .then((loadedImages) => {
          setImages(loadedImages);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to load images", error);
        });
    };

    fetchImages();

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
  }, [fetchUrl, imageCount]);

  useEffect(() => {
    if (!loading && innerContainerRef.current) {
      requestAnimationFrame(() => {
        innerContainerRef.current.scrollLeft =
          innerContainerRef.current.scrollWidth / 2;
      });
    }
  }, [loading]);

  return {
    containerRef,
    innerContainerRef,
    isDragging,
    loading,
    images: [...images, ...images],
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  };
};

export default useCarousel;
