import React from "react";
import { useState, useEffect } from "react";
import { BsArrowLeftCircleFill, BsArrowRightCircleFill } from "react-icons/bs";
import "./styles.css";
const Slider = ({
  url = "https://picsum.photos/v2/list",
  limit = 5,
  page = 1,
}) => {
  const [state, setState] = useState({
    images: [],
    currentSlide: 0,
    errorMsg: null,
    loading: false,
  });
  console.log(state, setState);

  const { images, currentSlide, errorMsg, loading } = state;
  const fetchImages = async () => {
    setState((prevState) => ({
      ...prevState,
      loading: true,
    }));
    try {
      const response = await fetch(`${url}?page=${page}&limit=${limit}`);
      const data = await response.json();
      if (data) {
        setState((prevState) => ({
          ...prevState,
          images: data,
          loading: false,
        }));
      }
    } catch (error) {
      setState((prevState) => ({
        ...prevState,
        errorMsg: error.message,
        loading: false,
      }));
    }
    console.log(images);
    console.log(data);
  };
  useEffect(() => {
    if (url) fetchImages();
  }, [url]);

  const handleNavigation = (direction) => {
    setState((prevState) => ({
      ...prevState,
      currentSlide:
        direction === "previous"
          ? currentSlide === 0
            ? images.length - 1
            : currentSlide - 1
          : currentSlide === images.length - 1
          ? 0
          : currentSlide + 1,
    }));
    console.log(currentSlide);
  };
  return (
    <div className="container">
      {loading && <div>Loading Data...</div>}
      {errorMsg && <div>Error Occured {errorMsg}</div>}
      {!loading && !errorMsg && (
        <>
          <BsArrowLeftCircleFill
            className="arrow arrow-left"
            onClick={() => handleNavigation("previous")}
          />
          {images.map((imageItem, index) => (
            <img
              key={imageItem.id}
              alt={imageItem.download_url}
              src={imageItem.download_url}
              className={`current-image ${
                currentSlide === index ? "" : "hide-current-image"
              }`}
            />
          ))}

          <BsArrowRightCircleFill
            className="arrow arrow-right"
            onClick={() => handleNavigation("next")}
          />
          <span className="circle-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                className={`current-indicator ${
                  currentSlide === index ? "" : "inactive-indicator"
                }`}
                onClick={() =>
                  setState((prevState) => ({
                    ...prevState,
                    currentSlide: index,
                  }))
                }
              ></button>
            ))}
          </span>
        </>
      )}
    </div>
  );
};

export default Slider;
