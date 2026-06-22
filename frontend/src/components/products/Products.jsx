import { useState, useEffect } from "react";
import { api } from "../../api";
import { Modal, FormField, Input, Button, Table, Card, Badge } from "../shared/UI";
import { useToast } from "../../context/ToastContext";

function ProductForm({ initial, onSubmit, onClose }) {
  const [form, setForm] = useState(initial || { name: "", sku: "", price: "", quantity: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.sku.trim()) e.sku = "SKU is required";
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) e.price = "Valid price required";
    if (!initial && (form.quantity === "" || isNaN(form.quantity) || Number(form.quantity) < 0)) e.quantity = "Valid quantity required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try {
      const payload = initial
        ? { name: form.name, price: Number(form.price), quantity: Number(form.quantity) }
        : { name: form.name, sku: form.sku, price: Number(form.price), quantity: Number(form.quantity) };
      await onSubmit(payload);
      onClose();
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {errors.submit && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#ef4444", marginBottom: 16, fontSize: 14 }}>{errors.submit}</div>}
      <FormField label="Product Name" error={errors.name}>
        <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Laptop Pro 15" />
      </FormField>
      {!initial && (
        <FormField label="SKU / Code" error={errors.sku}>
          <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="e.g. LAP-001" />
        </FormField>
      )}
      <FormField label="Price (₹)" error={errors.price}>
        <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
      </FormField>
      <FormField label="Quantity in Stock" error={errors.quantity}>
        <Input type="number" min="0" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="0" />
      </FormField>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Button onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
          {loading ? "Saving..." : initial ? "Update Product" : "Add Product"}
        </Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const toast = useToast();

  const load = () => api.getProducts().then(setProducts).catch(() => toast("Failed to load products", "error")).finally(() => setLoading(false));

  useEffect(() => { load(); }, []);

  const handleCreate = async (data) => {
    await api.createProduct(data);
    toast("Product created successfully!");
    load();
  };
  const handleUpdate = async (data) => {
    await api.updateProduct(editing.id, data);
    toast("Product updated!");
    load();
  };
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try { await api.deleteProduct(id); toast("Product deleted"); load(); }
    catch (e) { toast(e.message, "error"); }
  };

  const columns = [
    { key: "name", label: "Product Name" },
    { key: "sku", label: "SKU", render: (r) => <code style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontSize: 13 }}>{r.sku}</code> },
    { key: "price", label: "Price", render: (r) => `₹${Number(r.price).toFixed(2)}` },
    { key: "quantity", label: "Stock", render: (r) => <Badge color={r.quantity <= 10 ? "#ef4444" : "#10b981"}>{r.quantity}</Badge> },
    { key: "created_at", label: "Added", render: (r) => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0 }}>Products</h1>
          <p style={{ color: "#64748b", marginTop: 4 }}>{products.length} products in inventory</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>+ Add Product</Button>
      </div>
      <Card>
        {loading ? <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading...</p> : (
          <Table columns={columns} data={products} onEdit={setEditing} onDelete={handleDelete} />
        )}
      </Card>

      {showAdd && (
        <Modal title="Add New Product" onClose={() => setShowAdd(false)}>
          <ProductForm onSubmit={handleCreate} onClose={() => setShowAdd(false)} />
        </Modal>
      )}
      {editing && (
        <Modal title="Edit Product" onClose={() => setEditing(null)}>
          <ProductForm initial={editing} onSubmit={handleUpdate} onClose={() => setEditing(null)} />
        </Modal>
      )}
    </div>
  );
}
