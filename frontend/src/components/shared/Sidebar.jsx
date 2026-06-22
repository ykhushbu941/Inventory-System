const navItems = [
  { path: "/", label: "Dashboard", icon: "📊" },
  { path: "/products", label: "Products", icon: "📦" },
  { path: "/customers", label: "Customers", icon: "👥" },
  { path: "/orders", label: "Orders", icon: "🛒" },
];

export function Sidebar({ currentPath, onNavigate }) {
  return (
    <aside style={{
      width: 240, minHeight: "100vh", background: "#1e1b4b",
      display: "flex", flexDirection: "column", flexShrink: 0
    }}>
      <div style={{ padding: "28px 24px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 24 }}>🏭</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, letterSpacing: "-0.3px" }}>InvenTrack</div>
            <div style={{ color: "#a5b4fc", fontSize: 11 }}>Management System</div>
          </div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {navItems.map((item) => {
          const active = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              style={{
                display: "flex", alignItems: "center", gap: 12, width: "100%",
                padding: "11px 14px", borderRadius: 8, border: "none", cursor: "pointer",
                background: active ? "rgba(99,102,241,0.3)" : "transparent",
                color: active ? "#a5b4fc" : "#94a3b8",
                fontWeight: active ? 700 : 500, fontSize: 14,
                marginBottom: 4, textAlign: "left", transition: "all 0.2s"
              }}
              onMouseOver={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
              onMouseOut={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
              {active && <span style={{ marginLeft: "auto", width: 6, height: 6, borderRadius: "50%", background: "#6366f1" }}></span>}
            </button>
          );
        })}
      </nav>
      <div style={{ padding: "16px 24px", borderTop: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ color: "#475569", fontSize: 11 }}>v1.0.0 · Production Ready</div>
      </div>
    </aside>
  );
}
