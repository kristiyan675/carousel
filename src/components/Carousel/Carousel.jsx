import React from "react";
import PropTypes from "prop-types";
import useCarousel from "./useCarousel";
import "./Carousel.css";

const Carousel = ({
  fetchUrl = "https://picsum.photos/v2/list?page=1&limit=10",
  imageCount = 10,
  LoadingComponent = () => <div className="skeleton"></div>,
  containerClassName = "",
  itemClassName = "",
}) => {
  const {
    containerRef,
    innerContainerRef,
    isDragging,
    loading,
    images,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleMouseLeave,
  } = useCarousel(fetchUrl, imageCount);

  return (
    <div
      className={`container ${containerClassName}`}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div className="inner-container" ref={innerContainerRef}>
        {loading
          ? Array.from({ length: imageCount }).map((_, index) => (
              <LoadingComponent key={index} />
            ))
          : images.map((image, index) => (
              <div
                className={`item-wrapper ${itemClassName}`}
                key={index}
                onMouseDown={handleMouseDown}
              >
                <img
                  className="item"
                  src={image}
                  alt={`carousel-item-${index}`}
                  draggable="false"
                />
              </div>
            ))}
      </div>
    </div>
  );
};

Carousel.propTypes = {
  fetchUrl: PropTypes.string,
  imageCount: PropTypes.number,
  LoadingComponent: PropTypes.elementType,
  containerClassName: PropTypes.string,
  itemClassName: PropTypes.string,
};

export default Carousel;
