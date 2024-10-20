import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";

function ProductInfo({ product }) {
  const { t } = useTranslation();
  const { client } = useSelector((state) => state.clientData);
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product?.name,
          text: product?.description,
          url: window.location.href,
        })
        .then(() => t("Shared successfully"))
        .catch((error) => t("Error sharing:", error));
    } else {
      alert(t("share_not_supported"));
    }
  };

  const handleFavorite = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.post("/client/store-favorite", {
        product_id: product?.id,
      });
      if (res.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["product"] });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      throw new Error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="priceInfo mt-3">
        <h4 className="price">
          <span>{product?.price}</span> {product?.currency?.name}
        </h4>

        {client?.id !== product?.user?.id && (
          <button
            onClick={handleFavorite}
            disabled={loading}
            className={`favorite ${product?.is_favorite ? "active" : ""}`}
          >
            <i className="fa-light fa-heart"></i>
          </button>
        )}

        <div className="actions">
          <span className="action-btn report" onClick={handleShare}>
            <i className="fa-sharp fa-light fa-share-nodes"></i> {t("share")}
          </span>
          {client?.id !== product?.user?.id && (
            <span className="action-btn report">
              <i className="fa-regular fa-flag"></i> {t("report")}
            </span>
          )}
        </div>
      </div>

      <div className="itemInfo mt-3">
        <h3 className="title">{product?.name}</h3>

        <div className="itemBottom">
          <div className="location">
            <i className="fa-light fa-location-dot"></i>
            <span>
              {product?.country?.name}, {product?.city?.name}
            </span>
          </div>
          <div className="time">
            <i className="fa-light fa-clock"></i> {product?.create_at}
          </div>
        </div>
        <p className="description">{product?.description}</p>
      </div>
    </>
  );
}

export default ProductInfo;
