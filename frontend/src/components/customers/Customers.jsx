import { useState, useEffect } from "react";
import { api } from "../../api";
import { Modal, FormField, Input, Button, Table, Card } from "../shared/UI";
import { useToast } from "../../context/ToastContext";

function CustomerForm({ onSubmit, onClose }) {
  const [form, setForm] = useState({ full_name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.full_name.trim()) e.full_name = "Full name is required";
    if (!form.email.trim() || !form.email.includes("@")) e.email = "Valid email required";
    if (!form.phone.trim()) e.phone = "Phone is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length) return setErrors(e);
    setLoading(true);
    try { await onSubmit(form); onClose(); }
    catch (err) { setErrors({ submit: err.message }); }
    finally { setLoading(false); }
  };

  return (
    <div>
      {errors.submit && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#ef4444", marginBottom: 16, fontSize: 14 }}>{errors.submit}</div>}
      <FormField label="Full Name" error={errors.full_name}>
        <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} placeholder="e.g. Priya Sharma" />
      </FormField>
      <FormField label="Email Address" error={errors.email}>
        <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="priya@example.com" />
      </FormField>
      <FormField label="Phone Number" error={errors.phone}>
        <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 9876543210" />
      </FormField>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <Button onClick={handleSubmit} disabled={loading} style={{ flex: 1 }}>
          {loading ? "Saving..." : "Add Customer"}
        </Button>
        <Button variant="secondary" onClick={onClose}>Cancel</Button>
      </div>
    </div>
  );
}

export function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const toast = useToast();

  const load = () => api.getCustomers().then(setCustomers).catch(() => toast("Failed to load", "error")).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleCreate = async (data) => { await api.createCustomer(data); toast("Customer added!"); load(); };
  const handleDelete = async (id) => {
    if (!confirm("Delete this customer?")) return;
    try { await api.deleteCustomer(id); toast("Customer deleted"); load(); }
    catch (e) { toast(e.message, "error"); }
  };

  const columns = [
    { key: "full_name", label: "Full Name" },
    { key: "email", label: "Email", render: (r) => <a href={`mailto:${r.email}`} style={{ color: "#6366f1", textDecoration: "none" }}>{r.email}</a> },
    { key: "phone", label: "Phone" },
    { key: "created_at", label: "Joined", render: (r) => new Date(r.created_at).toLocaleDateString() },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0 }}>Customers</h1>
          <p style={{ color: "#64748b", marginTop: 4 }}>{customers.length} registered customers</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>+ Add Customer</Button>
      </div>
      <Card>
        {loading ? <p style={{ textAlign: "center", color: "#94a3b8" }}>Loading...</p> : (
          <Table columns={columns} data={customers} onDelete={handleDelete} />
        )}
      </Card>
      {showAdd && (
        <Modal title="Add New Customer" onClose={() => setShowAdd(false)}>
          <CustomerForm onSubmit={handleCreate} onClose={() => setShowAdd(false)} />
        </Modal>
      )}
    </div>
  );
}
