import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { isValidVideoExtension } from "../../utils/helpers";
import { useSelector } from "react-redux";
import ImageLoad from "../loaders/ImageLoad";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../utils/axiosInstance";

function ProductVertical({ product }) {
  const { t } = useTranslation();
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();
  const { client } = useSelector((state) => state.clientData);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await axiosInstance.post("/client/store-favorite", {
        product_id: product?.id,
      });
      if (res.status === 200) {
        queryClient.invalidateQueries({
          queryKey: ["products"],
        });
        queryClient.invalidateQueries({ queryKey: ["product"] });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(false);
  };

  return (
    <div className="product_vertical">
      <Link to={`/product/${product.id}`} className="img">
        {isValidVideoExtension(product?.image) ? (
          <video
            src={product.image}
            autoPlay
            loop
            muted
            playsInline
            onLoadedMetadata={handleImageLoad}
          />
        ) : (
          <img src={product.image} onLoad={handleImageLoad} alt="" />
        )}
        <ImageLoad isImageLoaded={isImageLoaded} />
        <span className="type">{t(`${product?.type}`)}</span>
      </Link>

      <div className="content">
        <Link to={`product/${product.id}`} className="title">
          <h3>{product.name}</h3>
          {client?.id !== product?.user?.id && (
            <Link
              disabled={loading}
              onClick={handleFavorite}
              className={`favourite_btn ${
                product?.is_favorite ? "active" : ""
              }`}
            >
              <i className="fa-light fa-heart"></i>
            </Link>
          )}
        </Link>

        <h3 className="price">
          <span>{product?.price}</span> {product?.currency?.name}
        </h3>

        <ul>
          <li className="w-100">
            <i className="fa-light fa-location-dot"> </i>{" "}
            {product.country?.name}, {product.city?.name}
          </li>

          <li style={{ flex: 1 }}>
            <Link to={`/profile/${product.user?.id}`}>
              <i className="fa-light fa-user"></i> {product.user?.username}
            </Link>
          </li>

          <li>
            <i className="fa-light fa-clock"></i> {product.date}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ProductVertical;
