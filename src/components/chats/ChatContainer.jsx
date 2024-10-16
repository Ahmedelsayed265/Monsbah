import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import axios from "axios";

function ChatContainer({ messages }) {
  const chatContainerRef = useRef(null);
  const GOOGLE_KEY = import.meta.env.VITE_GOOGLE_KEY;
  const { client } = useSelector((state) => state.clientData);
  const { lang } = useSelector((state) => state.language);
  const { t } = useTranslation();
  const [locations, setLocations] = useState({});

  const getLocationName = async (lat, lng, lang) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_KEY}&language=${lang}`
      );
      if (response.data.results.length > 0) {
        return response.data.results[0].formatted_address;
      } else {
        return lang === "ar" ? "موقع غير معروف" : "Unknown location";
      }
    } catch (error) {
      console.error("Error fetching location", error);
      return lang === "ar" ? "خطأ في الموقع" : "Location error";
    }
  };

  useEffect(() => {
    const fetchLocations = async () => {
      const locationPromises = messages
        ?.filter((message) => message?.type === "location")
        .map(async (message) => {
          const locationName = await getLocationName(
            message.lat,
            message.lng,
            lang
          );
          return { id: message.id, locationName };
        });

      const locationsData = await Promise.all(locationPromises);
      const locationMap = locationsData.reduce((acc, curr) => {
        acc[curr.id] = curr.locationName;
        return acc;
      }, {});
      setLocations(locationMap);
    };

    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, lang]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat_wrapper" ref={chatContainerRef}>
      {messages?.map((message) => (
        <div
          className={`message ${
            message?.sender_id === client?.id
              ? "sent-message"
              : "received-message"
          }`}
          key={message?.id}
        >
          <div className="d-flex flex-column">
            <div
              className={`message-content ${
                message?.type !== "text" ? "asset" : ""
              }`}
            >
              {message?.type === "text" && <p>{message?.message}</p>}
              {message?.type === "image" && <img src={message?.file} alt="" />}
              {message?.type === "voice" && (
                <audio src={message?.voice} controls />
              )}
              {message?.type === "file" && (
                <video src={message?.file} controls />
              )}
              {message?.type === "location" && (
                <Link
                  className="map_message"
                  target="_blank"
                  rel="noopener noreferrer"
                  to={`https://www.google.com/maps?q=${message?.lat},${message?.lng}`}
                >
                  <img
                    src={`https://maps.googleapis.com/maps/api/staticmap?center=${message?.lat},${message?.lng}&zoom=15&size=300x200&maptype=roadmap&markers=color:red%7Clabel:L%7C${message?.lat},${message?.lng}&key=${GOOGLE_KEY}`}
                    alt="location"
                  />
                  <span
                    className={message?.sender_id === client?.id ? "sent" : ""}
                  >
                    {locations[message?.id] ||
                      (lang === "ar"
                        ? "جاري استرداد الموقع..."
                        : "Fetching location...")}
                  </span>
                </Link>
              )}
              {message?.type === "contact" && (
                <>
                  <div className="contact_card">
                    <div className="icon">
                      <img src="/images/icons/contact.svg" alt="" />
                    </div>
                    <div className="content">
                      <h6>{message?.message?.split("%%")[0].trim()}</h6>
                      <h6>{message?.message?.split("%%")[1].trim()}</h6>
                    </div>
                  </div>
                  <Link
                    className="call"
                    to={`tel:${message?.message?.split("%%")[1]}`}
                  >
                    {t("chat.call")}
                  </Link>
                </>
              )}
            </div>
            <span
              className={`time ${
                message?.sender_id === client?.id ? "rec" : "sen"
              }`}
            >
              {message?.created_at}
            </span>
          </div>
          <div className="img">
            <img
              src={message?.sender_image}
              alt={message?.sender_name}
              loading="lazy"
              onError={(e) => (e.target.src = "/images/icons/user_default.png")}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ChatContainer;