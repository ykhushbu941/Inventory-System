const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function request(method, path, body = null) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${BASE_URL}${path}`, opts);
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Request failed");
  return data;
}

export const api = {
  // Products
  getProducts: () => request("GET", "/products"),
  getProduct: (id) => request("GET", `/products/${id}`),
  createProduct: (d) => request("POST", "/products", d),
  updateProduct: (id, d) => request("PUT", `/products/${id}`, d),
  deleteProduct: (id) => request("DELETE", `/products/${id}`),

  // Customers
  getCustomers: () => request("GET", "/customers"),
  getCustomer: (id) => request("GET", `/customers/${id}`),
  createCustomer: (d) => request("POST", "/customers", d),
  deleteCustomer: (id) => request("DELETE", `/customers/${id}`),

  // Orders
  getOrders: () => request("GET", "/orders"),
  getOrder: (id) => request("GET", `/orders/${id}`),
  createOrder: (d) => request("POST", "/orders", d),
  deleteOrder: (id) => request("DELETE", `/orders/${id}`),

  // Dashboard
  getDashboard: () => request("GET", "/dashboard"),
};
