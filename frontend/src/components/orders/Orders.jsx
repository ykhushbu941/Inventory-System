import { useState, useEffect } from "react";
import { api } from "../../api";
import { Modal, FormField, Button, Table, Card, Badge } from "../shared/UI";
import { useToast } from "../../context/ToastContext";

function CreateOrderForm({ onSubmit, onClose }) {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [customerId, setCustomerId] = useState("");
  const [items, setItems] = useState([{ product_id: "", quantity: 1 }]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    Promise.all([api.getCustomers(), api.getProducts()])
      .then(([c, p]) => { setCustomers(c); setProducts(p); });
  }, []);

  const addItem = () => setItems([...items, { product_id: "", quantity: 1 }]);
  const removeItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const updateItem = (i, key, val) => setItems(items.map((item, idx) => idx === i ? { ...item, [key]: val } : item));

  const getTotal = () => items.reduce((sum, item) => {
    const product = products.find((p) => p.id === Number(item.product_id));
    return sum + (product ? product.price * Number(item.quantity || 0) : 0);
  }, 0);

  const validate = () => {
    const e = {};
    if (!customerId) e.customer = "Select a customer";
    if (!items.length || items.some((i) => !i.product_id || !i.quantity || i.quantity < 1)) e.items = "Each item needs a product and quantity ≥ 1";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      await onSubmit({
        customer_id: Number(customerId),
        items: items.map((i) => ({ product_id: Number(i.product_id), quantity: Number(i.quantity) })),
      });
      onClose();
    } catch (err) { setErrors({ submit: err.message }); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {errors.submit && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#ef4444", marginBottom: 16, fontSize: 14 }}>{errors.submit}</div>}
      <FormField label="Customer" error={errors.customer}>
        <select value={customerId} onChange={(e) => setCustomerId(e.target.value)} style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 14 }}>
          <option value="">Select customer...</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.full_name} ({c.email})</option>)}
        </select>
      </FormField>
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 10, fontWeight: 600, fontSize: 13, color: "#374151" }}>Order Items</label>
        {errors.items && <p style={{ color: "#ef4444", fontSize: 12, marginTop: -6, marginBottom: 8 }}>{errors.items}</p>}
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "flex-end" }}>
            <div style={{ flex: 2 }}>
              <select value={item.product_id} onChange={(e) => updateItem(i, "product_id", e.target.value)}
                style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13 }}>
                <option value="">Select product...</option>
                {products.map((p) => <option key={p.id} value={p.id}>{p.name} (Stock: {p.quantity})</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(i, "quantity", e.target.value)}
                placeholder="Qty" style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0", borderRadius: 8, fontSize: 13, boxSizing: "border-box" }} />
            </div>
            {items.length > 1 && <Button variant="danger" style={{ padding: "10px 14px" }} onClick={() => removeItem(i)}>✕</Button>}
          </div>
        ))}
        <Button variant="secondary" onClick={addItem} style={{ width: "100%", marginTop: 4 }}>+ Add Item</Button>
      </div>
      <div style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 16px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 16, color: "#1e293b" }}>
          <span>Total Amount</span>
          <span style={{ color: "#6366f1" }}>₹{getTotal().toFixed(2)}</span>
        </div>
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        <Button onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>{loading ? "Creating..." : "Create Order"}</Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

function OrderDetailModal({ order, onClose }) {
  return (
    <Modal title={`Order #${order.id}`} onClose={onClose}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <Badge color="#6366f1">{order.status}</Badge>
        </div>
        <div style={{ background: "#f8fafc", borderRadius: 8, padding: "12px 16px", marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: "#64748b", marginBottom: 4 }}>Customer</div>
          <div style={{ fontWeight: 600, color: "#1e293b" }}>{order.customer?.full_name || "—"}</div>
          <div style={{ fontSize: 13, color: "#64748b" }}>{order.customer?.email}</div>
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Items</div>
          {order.items?.map((item) => (
            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #f1f5f9", fontSize: 14 }}>
              <div>
                <div style={{ fontWeight: 500, color: "#1e293b" }}>{item.product?.name || `Product #${item.product_id}`}</div>
                <div style={{ color: "#64748b", fontSize: 12 }}>Qty: {item.quantity} × ₹{item.unit_price}</div>
              </div>
              <div style={{ fontWeight: 700, color: "#1e293b" }}>₹{(item.quantity * item.unit_price).toFixed(2)}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 800, fontSize: 17, color: "#1e293b", marginTop: 16 }}>
          <span>Total</span>
          <span style={{ color: "#6366f1" }}>₹{order.total_amount?.toFixed(2)}</span>
        </div>
      </div>
      <Button variant="secondary" onClick={onClose} style={{ width: "100%" }}>Close</Button>
    </Modal>
  );
}

export function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [viewOrder, setViewOrder] = useState(null);
  const toast = useToast();

  const load = () => api.getOrders().then(setOrders).catch(() => toast("Failed to load orders", "error")).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleCreate = async (data) => { await api.createOrder(data); toast("Order created!"); load(); };
  const handleDelete = async (id) => {
    if (!confirm("Cancel this order? Stock will be restored.")) return;
    try { await api.deleteOrder(id); toast("Order cancelled, stock restored"); load(); }
    catch (e) { toast(e.message, "error"); }
  };

  const handleView = async (row) => {
    try { const order = await api.getOrder(row.id); setViewOrder(order); }
    catch { toast("Failed to load order details", "error"); }
  };

  const columns = [
    { key: "id", label: "Order #", render: (r) => `#${r.id}` },
    { key: "customer", label: "Customer", render: (r) => r.customer?.full_name || `Customer #${r.customer_id}` },
    { key: "items", label: "Items", render: (r) => `${r.items?.length || 0} item(s)` },
    { key: "total_amount", label: "Total", render: (r) => <strong style={{ color: "#6366f1" }}>₹{Number(r.total_amount).toFixed(2)}</strong> },
    { key: "status", label: "Status", render: (r) => <Badge color="#10b981">{r.status}</Badge> },
    { key: "created_at", label: "Date", render: (r) => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0 }}>Orders</h1>
          <p style={{ color: "#64748b", marginTop: 4 }}>{orders.length} total orders</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ Create Order</Button>
      </div>
      <Card>
        {loading ? <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading...</p> : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
            <thead>
              <tr style={{ background: "#f8fafc" }}>
                {columns.map((c) => <th key={c.key} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1.5px solid #e2e8f0" }}>{c.label}</th>)}
                <th style={{ padding: "12px 16px", borderBottom: "1.5px solid #e2e8f0" }}></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr><td colSpan={columns.length + 1} style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No orders yet.</td></tr>
              ) : orders.map((row) => (
                <tr key={row.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  {columns.map((c) => <td key={c.key} style={{ padding: "12px 16px", color: "#1e293b" }}>{c.render ? c.render(row) : row[c.key]}</td>)}
                  <td style={{ padding: "12px 16px", display: "flex", gap: 8 }}>
                    <Button variant="secondary" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => handleView(row)}>View</Button>
                    <Button variant="danger" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => handleDelete(row.id)}>Cancel</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
      {showCreate && (
        <Modal title="Create New Order" onClose={() => setShowCreate(false)}>
          <CreateOrderForm onSubmit={handleCreate} onClose={() => setShowCreate(false)} />
        </Modal>
      )}
      {viewOrder && <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />}
    </div>
  );
}
