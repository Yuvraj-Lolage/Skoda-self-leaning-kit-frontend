// CreateSubModule.tsx
import React, { useEffect, useState } from "react";
import "./create_module.css";

type Message = { type: "success" | "error"; text: string } | null;
type Errors = { parentModuleId?: string; submoduleName?: string; submoduleId?: string };

type ModuleOption = {
  id: string;
  name: string;
};

export default function CreateSubModule(): React.JSX.Element {
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [parentModuleId, setParentModuleId] = useState<string>("");
  const [submoduleName, setSubmoduleName] = useState<string>("");
  const [submoduleId, setSubmoduleId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingModules, setLoadingModules] = useState<boolean>(true);
  const [message, setMessage] = useState<Message>(null);
  const [errors, setErrors] = useState<Errors>({});

  useEffect(() => {
    let mounted = true;
    const fetchModules = async () => {
      setLoadingModules(true);
      try {
        const res = await fetch("/api/superadmin/modules");
        if (!res.ok) {
          // gracefully ignore and keep empty list
          return;
        }
        const json = await res.json();
        // Expecting array of modules: [{ id, name }, ...]
        if (mounted && Array.isArray(json)) {
          const opts = json.map((m: any) => ({
            id: String(m.id ?? m._id ?? m.slug ?? m.moduleId ?? ""),
            name: String(m.name ?? m.title ?? ""),
          })).filter((m: ModuleOption) => m.id);
          setModules(opts);
          if (opts.length === 1) setParentModuleId(opts[0].id);
        }
      } catch {
        // network error — keep modules empty
      } finally {
        if (mounted) setLoadingModules(false);
      }
    };

    fetchModules();
    return () => { mounted = false; };
  }, []);

  const validate = (): Errors => {
    const e: Errors = {};
    if (!parentModuleId.trim()) e.parentModuleId = "Please select a parent module.";
    if (!submoduleName.trim()) e.submoduleName = "Submodule name is required.";
    else if (submoduleName.trim().length < 2) e.submoduleName = "Name must be at least 2 characters.";
    if (!submoduleId.trim()) e.submoduleId = "Submodule ID is required.";
    else if (!/^[A-Za-z0-9-_]{2,40}$/.test(submoduleId.trim()))
      e.submoduleId = "ID: 2–40 chars, letters/numbers/-/_ only.";
    return e;
  };

  const resetForm = () => {
    setParentModuleId("");
    setSubmoduleName("");
    setSubmoduleId("");
    setErrors({});
    setMessage(null);
  };

  const generateIdFromName = (name: string): string =>
    name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-_]/g, "")
      .slice(0, 40);

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    setMessage(null);
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;

    setLoading(true);
    try {
      const payload = {
        parentModuleId: parentModuleId.trim(),
        name: submoduleName.trim(),
        id: submoduleId.trim(),
      };

      const res = await fetch("/api/superadmin/submodules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        setMessage({ type: "success", text: json.message || "Submodule created." });
        resetForm();
      } else {
        let err = `Server ${res.status}`;
        try {
          const j = await res.json();
          err = j.error || j.message || JSON.stringify(j);
        } catch {}
        setMessage({ type: "error", text: `Unable to create submodule — ${err}` });
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
            <h3 className="cm-title">Create SubModule</h3>
            <p className="cm-sub">Add a new submodule under an existing module</p>
          </div>
          <div className="cm-header-badge">Administration</div>
        </div>

        <form className="cm-form" onSubmit={handleSubmit} noValidate>
          <label className="cm-label">
            Parent Module
            <div style={{ marginTop: 8 }}>
              <select
                className={`cm-input ${errors.parentModuleId ? "cm-input-error" : ""}`}
                value={parentModuleId}
                onChange={(e) => setParentModuleId(e.target.value)}
                disabled={loading || loadingModules}
              >
                <option value="">{loadingModules ? "Loading modules…" : "Select a module"}</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {errors.parentModuleId && <div className="cm-error">{errors.parentModuleId}</div>}
            </div>
          </label>

          <label className="cm-label">
            Submodule Name
            <input
              className={`cm-input ${errors.submoduleName ? "cm-input-error" : ""}`}
              type="text"
              value={submoduleName}
              onChange={(e) => setSubmoduleName(e.target.value)}
              onBlur={() => {
                if (!submoduleId.trim() && submoduleName.trim()) setSubmoduleId(generateIdFromName(submoduleName));
              }}
              placeholder="e.g. Authentication & Authorization"
              disabled={loading}
            />
            {errors.submoduleName && <div className="cm-error">{errors.submoduleName}</div>}
          </label>

          <label className="cm-label">
            Submodule ID
            <input
              className={`cm-input ${errors.submoduleId ? "cm-input-error" : ""}`}
              type="text"
              value={submoduleId}
              onChange={(e) => setSubmoduleId(e.target.value)}
              placeholder="e.g. auth-and-authorization"
              disabled={loading}
            />
            {errors.submoduleId && <div className="cm-error">{errors.submoduleId}</div>}
          </label>

          <div className="cm-actions">
            <button type="submit" className="cm-btn primary" disabled={loading}>
              {loading ? "Creating…" : "Create SubModule"}
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
          Tip: Submodule IDs must be unique within the system. If parent modules are missing, create the parent module first.
        </div>
      </div>
    </div>
  );
}
