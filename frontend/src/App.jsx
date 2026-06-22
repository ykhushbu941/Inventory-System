import { useState } from "react";
import { Sidebar } from "./components/shared/Sidebar";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Products } from "./components/products/Products";
import { Customers } from "./components/customers/Customers";
import { Orders } from "./components/orders/Orders";
import { ToastProvider } from "./context/ToastContext";

const routes = {
  "/": Dashboard,
  "/products": Products,
  "/customers": Customers,
  "/orders": Orders,
};

function App() {
  const [path, setPath] = useState("/");
  const Page = routes[path] || Dashboard;

  return (
    <ToastProvider>
      <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: "#f8fafc" }}>
        <Sidebar currentPath={path} onNavigate={setPath} />
        <main style={{ flex: 1, padding: "32px 36px", overflowY: "auto" }}>
          <Page />
        </main>
      </div>
    </ToastProvider>
  );
}

export default App;
