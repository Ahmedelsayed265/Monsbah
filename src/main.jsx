import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App";
import InterceptorProvider from "./providers/InterceptorProvider";

const queryClient = new QueryClient();

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/react-toastify/dist/ReactToastify.css";
import "./assets/styles/all.min.css";
import "./assets/styles/main.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <ReactQueryDevtools initialIsOpen={false} />
    <ToastContainer autoClose={2000} />
    <Provider store={store}>
      <InterceptorProvider>
        <App />
      </InterceptorProvider>
    </Provider>
  </QueryClientProvider>
);
