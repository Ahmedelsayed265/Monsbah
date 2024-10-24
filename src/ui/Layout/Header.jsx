import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, NavLink } from "react-router-dom";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../redux/slices/language";
import i18next from "i18next";
import GetApp from "../modals/GetApp";
import AuthModal from "../../components/auth/AuthModal";
import useGetNotifications from "../../hooks/notifications/useGetNotifications";
import NotificationCard from "../cards/NotificationCard";
import useAuth from "../../hooks/useAuth";

export default function Header() {
  const { t } = useTranslation();
  const [avatarError, setAvatarError] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.clientData.client);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState("login");
  const [showGetAppModal, setShowGetAppModal] = useState(false);
  const { data: notifications, total } = useGetNotifications();

  const { isAuthed } = useAuth();

  const handleLang = (newLang) => {
    dispatch(setLanguage(newLang));
    i18next.changeLanguage(newLang);
    const bodyElement = document.querySelector("body");
    if (bodyElement) {
      bodyElement.classList.toggle("en", newLang === "en");
    }
  };

  return (
    <header>
      <div className="container">
        <div className="mainLinks">
          <Link to="/" className="navbar-brand">
            <img src="/images/branding/icon.svg" loading="lazy" alt="" />
          </Link>

          <nav className="navbar navbar-expand-lg">
            <ul className="navbar-nav">
              <Link className="logo" to="/">
                <img src="/images/branding/logo.svg" loading="lazy" alt="" />
              </Link>

              <NavLink className="navLink" to="/">
                {t("header.home")}
              </NavLink>
              <NavLink className="navLink" to="/categories">
                {t("header.categories")}
              </NavLink>
              <NavLink className="navLink" to="/asks">
                {t("header.asks")}
              </NavLink>
              <NavLink className="navLink" to="/about-us">
                {t("aboutUs")}
              </NavLink>
              <NavLink className="navLink" to="/chats">
                {t("header.chats")}
              </NavLink>
              <NavLink className="navLink" to="/contact-us">
                {t("header.contact")}
              </NavLink>
            </ul>
          </nav>

          <div className="moreActions">
            <button
              className="customBtn"
              onClick={() => setShowGetAppModal(true)}
            >
              {t("header.getApp")}
            </button>

            <Link
              to="/profile?tab=addAd"
              className="link text d-lg-flex d-none"
            >
              <img src="/images/icons/plus.svg" alt="" />
              {t("header.addPost")}
            </Link>

            {isAuthed ? (
              <Dropdown>
                <Dropdown.Toggle id="dropdown-basic" className="link">
                  <img src="/images/icons/bell.svg" alt="" />
                  {total ? (
                    <span className="count">
                      {" "}
                      {total < 100 ? total : "99+"}{" "}
                    </span>
                  ) : null}
                </Dropdown.Toggle>
                <Dropdown.Menu className="drop_Message_Menu">
                  <div className="scroll_menu">
                    {notifications?.map((item) => (
                      <NotificationCard key={item.id} item={item} />
                    ))}
                  </div>
                  <Link
                    className="showall"
                    to="/notifcations"
                    style={{ textDecoration: "none" }}
                  >
                    عرض جميع الاشعارات
                  </Link>
                </Dropdown.Menu>
              </Dropdown>
            ) : null}

            <Dropdown>
              <Dropdown.Toggle id="dropdown-basic" className="link">
                <img src="/images/icons/lang.svg" alt="" />
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleLang("ar")}>
                  العربية
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleLang("en")}>
                  English
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Link to="/search" className="link">
              <img src="/images/icons/search.svg" alt="" />
            </Link>

            {user?.id ? (
              <Link to="/profile" className="link profile-link">
                <img
                  src={avatarError ? "/images/icons/user.svg" : user?.image}
                  alt="user"
                  onError={() => setAvatarError(true)}
                />
              </Link>
            ) : (
              <button
                className="link"
                onClick={() => {
                  setShowAuthModal(true);
                  setAuthType("login");
                }}
              >
                <img src="/images/icons/user.svg" alt="user" />
              </button>
            )}
          </div>
        </div>
      </div>

      <GetApp show={showGetAppModal} setShow={setShowGetAppModal} />
      <AuthModal
        type={authType}
        show={showAuthModal}
        setShow={setShowAuthModal}
      />
    </header>
  );
}
