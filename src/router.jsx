import About from "./routes/About";
import AddAd from "./routes/AddAd";
import Chats from "./routes/Chats";
import Contact from "./routes/Contact";
import ErrorPage from "./routes/ErrorPage";
import Home from "./routes/Home";
import ProductDetails from "./routes/ProductDetails";
import Profile from "./routes/Profile";

import AltProfile from "./routes/AltProfile";
import Search from "./routes/Search";
import Terms from "./routes/Terms";
import Verification from "./routes/Verification";
import UserProfile from "./routes/UserProfile";

const router = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "about-us",
    element: <About />,
  },
  {
    path: "chats",
    element: <Chats />,
    protected: true,
  },
  {
    path: "search/*",
    element: <Search />,
  },
  {
    path: "contact-us",
    element: <Contact />,
  },
  {
    path: "terms-and-conditions",
    element: <Terms />,
  },
  {
    path: "profile",
    element: <Profile />,
    protected: true,
  },
  {
    path: "profile/:id",
    element: <UserProfile />,
  },
  {
    path: "alt-profile/*",
    element: <AltProfile />,
  },
  {
    path: "verification",
    element: <Verification />,
  },
  {
    path: "add-ad",
    element: <AddAd />,
  },
  {
    path: "product/:id",
    element: <ProductDetails />,
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
];

export default router;