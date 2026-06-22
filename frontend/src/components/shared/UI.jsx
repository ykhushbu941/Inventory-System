export function Modal({ title, onClose, children }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16
    }} onClick={onClose}>
      <div style={{
        background: "#fff", borderRadius: 12, padding: 28, width: "100%",
        maxWidth: 520, maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#1e293b" }}>{title}</h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#94a3b8", lineHeight: 1
          }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function FormField({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", marginBottom: 6, fontWeight: 600, fontSize: 13, color: "#374151" }}>{label}</label>
      {children}
      {error && <p style={{ margin: "4px 0 0", color: "#ef4444", fontSize: 12 }}>{error}</p>}
    </div>
  );
}

export function Input({ ...props }) {
  return (
    <input {...props} style={{
      width: "100%", padding: "10px 12px", border: "1.5px solid #e2e8f0",
      borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box",
      transition: "border 0.2s", ...props.style
    }} />
  );
}

export function Button({ variant = "primary", children, ...props }) {
  const styles = {
    primary: { background: "#6366f1", color: "#fff" },
    danger: { background: "#ef4444", color: "#fff" },
    secondary: { background: "#f1f5f9", color: "#374151" },
    success: { background: "#10b981", color: "#fff" },
  };
  return (
    <button {...props} style={{
      padding: "10px 20px", border: "none", borderRadius: 8, fontWeight: 600,
      cursor: "pointer", fontSize: 14, transition: "opacity 0.2s",
      ...styles[variant], ...props.style
    }}
    onMouseOver={(e) => e.currentTarget.style.opacity = "0.85"}
    onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
    >{children}</button>
  );
}

export function Table({ columns, data, onDelete, onEdit, deleteLabel = "Delete" }) {
  if (!data?.length) return (
    <p style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>No records found.</p>
  );
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {columns.map((c) => (
              <th key={c.key} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#64748b", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1.5px solid #e2e8f0" }}>
                {c.label}
              </th>
            ))}
            {(onDelete || onEdit) && <th style={{ padding: "12px 16px", borderBottom: "1.5px solid #e2e8f0" }}></th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} style={{ borderBottom: "1px solid #f1f5f9" }}
              onMouseOver={(e) => e.currentTarget.style.background = "#f8fafc"}
              onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
              {columns.map((c) => (
                <td key={c.key} style={{ padding: "12px 16px", color: "#1e293b" }}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
              {(onDelete || onEdit) && (
                <td style={{ padding: "12px 16px", display: "flex", gap: 8 }}>
                  {onEdit && <Button variant="secondary" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => onEdit(row)}>Edit</Button>}
                  {onDelete && <Button variant="danger" style={{ padding: "6px 14px", fontSize: 13 }} onClick={() => onDelete(row.id)}>{deleteLabel}</Button>}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Badge({ children, color = "#6366f1" }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px", borderRadius: 20,
      background: color + "20", color, fontWeight: 600, fontSize: 12
    }}>{children}</span>
  );
}

export function Card({ children, style }) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 24, boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9", ...style }}>
      {children}
    </div>
  );
}
