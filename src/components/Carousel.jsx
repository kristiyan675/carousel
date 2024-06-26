import React, { useRef, useState, useEffect } from "react";
import "./Carousel.css";

const Carousel = ({ images }) => {
  const containerRef = useRef(null);
  const innerContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
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

      // Ensure initial scroll position is set correctly
      requestAnimationFrame(() => {
        innerContainerRef.current.scrollLeft =
          innerContainerRef.current.scrollWidth / 4;
        console.log(innerContainerRef.current.scrollLeft, " 1");
      });

      return () => {
        innerContainerRef.current.removeEventListener("scroll", scrollHandler);
      };
    }
  }, [innerContainerRef.current]);

  return (
    <div
      className="container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="inner-container" ref={innerContainerRef}>
        {duplicatedImages.map((image, index) => (
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
