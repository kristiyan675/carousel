import React, { useRef, useState, useEffect } from "react";
import "./Carousel.css";

const Carousel = ({ images }) => {
  const containerRef = useRef(null);
  const innerContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

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

    // Apply bounce effect if scrolled to the end
    if (
      innerContainerRef.current.scrollLeft <= 0 ||
      innerContainerRef.current.scrollLeft >=
        innerContainerRef.current.scrollWidth -
          innerContainerRef.current.clientWidth
    ) {
      innerContainerRef.current.classList.add("bounce");
      setTimeout(() => {
        innerContainerRef.current.classList.remove("bounce");
      }, 500); // duration of the bounce animation
    }
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

  return (
    <div
      className="container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="inner-container" ref={innerContainerRef}>
        {images.map((image, index) => (
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
