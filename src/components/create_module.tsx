import React, { useState } from "react";
import "./create_module.css";

export default function CreateModule() {
  const [moduleName, setModuleName] = useState("");
  const [moduleId, setModuleId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: string; text: string } | null>(null); // {type, text}
  const [errors, setErrors] = useState<{ moduleName?: string; moduleId?: string }>({});

  const validate = (): { moduleName?: string; moduleId?: string } => {
    const e: { moduleName?: string; moduleId?: string } = {};
    if (!moduleName.trim()) e.moduleName = "Module name is required.";
    else if (moduleName.trim().length < 2) e.moduleName = "Name must be at least 2 characters.";
    if (!moduleId.trim()) e.moduleId = "Module ID is required.";
    else if (!/^[A-Za-z0-9-_]{2,30}$/.test(moduleId.trim()))
      e.moduleId = "ID: 2–30 chars, letters/numbers/-/_ only.";
    return e;
  };

  const resetForm = () => {
    setModuleName("");
    setModuleId("");
    setErrors({});
    setMessage(null);
  };

  const generateIdFromName = (name: string): string =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "")
      .slice(0, 30);

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setMessage(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      // CHANGE THIS URL to your backend endpoint
      const res = await fetch("/api/superadmin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: moduleName.trim(), id: moduleId.trim() }),
      });

      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        setMessage({ type: "success", text: json.message || "Module created." });
        resetForm();
      } else {
        let err = `Server ${res.status}`;
        try {
          const j = await res.json();
          err = j.error || j.message || JSON.stringify(j);
        } catch {}
        setMessage({ type: "error", text: `Unable to create module — ${err}` });
      }
    } catch (err) {
      const errorMsg =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: unknown }).message)
          : String(err);
      setMessage({ type: "error", text: `Network error: ${errorMsg}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cm-root">
      <div className="cm-card">
        <div className="cm-header">
          <div>
            <h3 className="cm-title">Create Module</h3>
            <p className="cm-sub">Add a new training module for learners</p>
          </div>
          <div className="cm-header-badge">Administration</div>
        </div>

        <form className="cm-form" onSubmit={handleSubmit} noValidate>
          <label className="cm-label">
            Module Name
            <input
              className={`cm-input ${errors.moduleName ? "cm-input-error" : ""}`}
              type="text"
              value={moduleName}
              onChange={(e) => setModuleName(e.target.value)}
              onBlur={() => {
                if (!moduleId.trim() && moduleName.trim()) setModuleId(generateIdFromName(moduleName));
              }}
              placeholder="e.g. Full Stack Development"
              disabled={loading}
            />
            {errors.moduleName && <div className="cm-error">{errors.moduleName}</div>}
          </label>

          <label className="cm-label">
            Module ID
            <input
              className={`cm-input ${errors.moduleId ? "cm-input-error" : ""}`}
              type="text"
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              placeholder="e.g. full-stack-development"
              disabled={loading}
            />
            {errors.moduleId && <div className="cm-error">{errors.moduleId}</div>}
          </label>

          <div className="cm-actions">
            <button type="submit" className="cm-btn primary" disabled={loading}>
              {loading ? "Creating…" : "Create Module"}
            </button>

            <button
              type="button"
              className="cm-btn ghost"
              onClick={resetForm}
              disabled={loading}
            >
              Reset
            </button>
          </div>
        </form>

        {message && (
          <div className={`cm-toast ${message.type === "success" ? "success" : "error"}`}>
            {message.text}
          </div>
        )}

        <div className="cm-hint">
          Tip: IDs must be unique. The name can be used to auto-generate an ID on blur.
        </div>
      </div>
    </div>
  );
}
