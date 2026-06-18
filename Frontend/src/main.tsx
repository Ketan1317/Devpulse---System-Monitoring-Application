import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/authContext";
import { Toaster } from "sonner";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
      <Toaster richColors />
    </AuthProvider>
  </BrowserRouter>
);