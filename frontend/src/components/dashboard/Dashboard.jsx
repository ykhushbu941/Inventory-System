import { useState, useEffect } from "react";
import { api } from "../../api";
import { Card, Badge } from "../shared/UI";

function StatCard({ label, value, icon, color }) {
  return (
    <Card style={{ display: "flex", alignItems: "center", gap: 20 }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, background: color + "15",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#1e293b" }}>{value}</div>
        <div style={{ color: "#64748b", fontSize: 13, fontWeight: 500 }}>{label}</div>
      </div>
    </Card>
  );
}

export function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getDashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, color: "#64748b" }}>Loading dashboard...</div>;
  if (!stats) return <div style={{ padding: 40, color: "#ef4444" }}>Failed to load dashboard.</div>;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: "#1e293b", margin: 0 }}>Dashboard</h1>
        <p style={{ color: "#64748b", marginTop: 4 }}>Overview of your inventory and operations</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20, marginBottom: 32 }}>
        <StatCard label="Total Products" value={stats.total_products} icon="📦" color="#6366f1" />
        <StatCard label="Total Customers" value={stats.total_customers} icon="👥" color="#10b981" />
        <StatCard label="Total Orders" value={stats.total_orders} icon="🛒" color="#f59e0b" />
        <StatCard label="Low Stock Items" value={stats.low_stock_products.length} icon="⚠️" color="#ef4444" />
      </div>

      <Card>
        <h2 style={{ margin: "0 0 16px", fontSize: 17, fontWeight: 700, color: "#1e293b" }}>
          ⚠️ Low Stock Products <span style={{ fontWeight: 400, color: "#94a3b8", fontSize: 13 }}>(≤ 10 units)</span>
        </h2>
        {stats.low_stock_products.length === 0 ? (
          <p style={{ color: "#10b981", fontWeight: 500 }}>✅ All products are well stocked!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stats.low_stock_products.map((p) => (
              <div key={p.id} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 16px", background: "#fef2f2", borderRadius: 8, border: "1px solid #fecaca"
              }}>
                <div>
                  <div style={{ fontWeight: 600, color: "#1e293b", fontSize: 14 }}>{p.name}</div>
                  <div style={{ color: "#64748b", fontSize: 12, marginTop: 2 }}>SKU: {p.sku}</div>
                </div>
                <Badge color="#ef4444">{p.quantity} left</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
