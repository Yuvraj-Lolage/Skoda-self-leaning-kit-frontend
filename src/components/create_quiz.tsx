// CreateQuiz.tsx
import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import "./create_module.css";

type Message = { type: "success" | "error"; text: string } | null;
type ModuleOption = { id: string; name: string };
type SubmoduleOption = { id: string; name: string };

type RawQuestion = {
  question: string;
  options?: string[]; // optional array of options
  answer?: string | number | boolean; // exact match to one of the options or value
  explanation?: string;
  marks?: number;
};

export default function CreateQuiz(): React.ReactElement {
  const [modules, setModules] = useState<ModuleOption[]>([]);
  const [submodules, setSubmodules] = useState<SubmoduleOption[]>([]);

  const [moduleId, setModuleId] = useState<string>("");
  const [submoduleId, setSubmoduleId] = useState<string>("");

  const [pasteJson, setPasteJson] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [questions, setQuestions] = useState<RawQuestion[]>([]);
  const [loadingModules, setLoadingModules] = useState<boolean>(true);
  const [loadingSubmodules, setLoadingSubmodules] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [message, setMessage] = useState<Message>(null);
  const [errors, setErrors] = useState<{ module?: string; submodule?: string; questions?: string }>({});

  // Load modules on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingModules(true);
      try {
        const res = await fetch("/api/superadmin/modules");
        if (!res.ok) return;
        const json = await res.json();
        if (!mounted) return;
        if (Array.isArray(json)) {
          const opts = json
            .map((m: any) => ({ id: String(m.id ?? m._id ?? m.slug ?? ""), name: String(m.name ?? m.title ?? "") }))
            .filter((m: ModuleOption) => m.id);
          setModules(opts);
          if (opts.length === 1) setModuleId(opts[0].id);
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoadingModules(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  // Load submodules when moduleId changes
  useEffect(() => {
    if (!moduleId) {
      setSubmodules([]);
      setSubmoduleId("");
      return;
    }
    let mounted = true;
    const loadSub = async () => {
      setLoadingSubmodules(true);
      try {
        // Expected API: GET /api/superadmin/modules/:id/submodules or /api/superadmin/submodules?moduleId=...
        const res = await fetch(`/api/superadmin/modules/${encodeURIComponent(moduleId)}/submodules`);
        if (!res.ok) {
          // fallback to query param endpoint
          const fallback = await fetch(`/api/superadmin/submodules?moduleId=${encodeURIComponent(moduleId)}`);
          if (!fallback.ok) return;
          const fallbackJson = await fallback.json();
          if (!mounted) return;
          if (Array.isArray(fallbackJson)) {
            const opts = fallbackJson.map((s: any) => ({ id: String(s.id ?? s._id ?? s.slug ?? ""), name: String(s.name ?? s.title ?? "") })).filter(Boolean);
            setSubmodules(opts);
            if (opts.length === 1) setSubmoduleId(opts[0].id);
          }
          return;
        }
        const json = await res.json();
        if (!mounted) return;
        if (Array.isArray(json)) {
          const opts = json.map((s: any) => ({ id: String(s.id ?? s._id ?? s.slug ?? ""), name: String(s.name ?? s.title ?? "") })).filter(Boolean);
          setSubmodules(opts);
          if (opts.length === 1) setSubmoduleId(opts[0].id);
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setLoadingSubmodules(false);
      }
    };
    loadSub();
    return () => {
      mounted = false;
    };
  }, [moduleId]);

  // Helpers to parse files
  const parseJsonText = (text: string): RawQuestion[] | null => {
    try {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed)) {
        // Attempt to normalize items to RawQuestion
        return parsed.map((it) => ({
          question: String(it.question ?? it.q ?? it.title ?? ""),
          options: Array.isArray(it.options) ? it.options.map(String) : undefined,
          answer: it.answer ?? it.correct ?? it.key ?? undefined,
          explanation: it.explanation ?? it.explanatory ?? undefined,
          marks: typeof it.marks === "number" ? it.marks : undefined,
        }));
      } else if (typeof parsed === "object" && parsed !== null && Array.isArray((parsed as any).questions)) {
        return (parsed as any).questions.map((it: any) => ({
          question: String(it.question ?? it.q ?? it.title ?? ""),
          options: Array.isArray(it.options) ? it.options.map(String) : undefined,
          answer: it.answer ?? it.correct ?? it.key ?? undefined,
          explanation: it.explanation ?? undefined,
          marks: typeof it.marks === "number" ? it.marks : undefined,
        }));
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleFile = (file: File | null) => {
    setMessage(null);
    setFileName("");
    setQuestions([]);
    setPasteJson("");
    if (!file) return;

    setFileName(file.name);
    const lower = file.name.toLowerCase();
    if (lower.endsWith(".json")) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result ?? "");
        const parsed = parseJsonText(text);
        if (!parsed) {
          setErrors({ questions: "JSON format not recognized. Expect array of question objects." });
        } else {
          setErrors({});
          setQuestions(parsed);
        }
      };
      reader.onerror = () => setErrors({ questions: "Unable to read JSON file." });
      reader.readAsText(file);
      return;
    }

    // Try Excel parsing for .xls/.xlsx/.csv
    if (lower.endsWith(".xls") || lower.endsWith(".xlsx") || lower.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = reader.result;
          const workbook = XLSX.read(data, { type: "array" });
          // Use first sheet
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          // Convert to JSON rows
          const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: null });
          // Expect columns like: question, option1, option2, option3, option4, answer (or options as JSON string)
          const normalized: RawQuestion[] = rows.map((r) => {
            const q = String(r.question ?? r.q ?? r.Question ?? "");
            // collect option columns
            const opts: string[] = [];
            // common column names checks
            ["option1", "option2", "option3", "option4", "opt1", "opt2", "opt3", "opt4", "a", "b", "c", "d"].forEach((col) => {
              if (col in r && r[col] != null && String(r[col]).trim() !== "") opts.push(String(r[col]));
            });
            // if there is a column `options` as JSON string or semicolon separated
            if (opts.length === 0 && r.options) {
              if (typeof r.options === "string") {
                try {
                  const maybe = JSON.parse(r.options);
                  if (Array.isArray(maybe)) opts.push(...maybe.map(String));
                } catch {
                  // fallback: split by comma or semicolon
                  opts.push(...String(r.options).split(/[,;|]/).map((s) => s.trim()).filter(Boolean));
                }
              } else if (Array.isArray(r.options)) {
                opts.push(...r.options.map(String));
              }
            }
            const answer = r.answer ?? r.correct ?? r.key ?? null;
            const explanation = r.explanation ?? r.explanatory ?? null;
            const marks = typeof r.marks === "number" ? r.marks : undefined;
            return { question: q, options: opts.length ? opts : undefined, answer, explanation, marks };
          });
          setErrors({});
          setQuestions(normalized);
        } catch (err) {
          setErrors({ questions: "Unable to parse spreadsheet. Ensure it has a valid first sheet." });
        }
      };
      reader.onerror = () => setErrors({ questions: "Unable to read file." });
      reader.readAsArrayBuffer(file);
      return;
    }

    setErrors({ questions: "Unsupported file type. Use .json, .xls, .xlsx or .csv" });
  };

  // When user pastes JSON into textarea
  const handlePasteJson = () => {
    setMessage(null);
    setFileName("");
    setQuestions([]);
    setErrors({});
    if (!pasteJson.trim()) {
      setErrors({ questions: "Paste JSON first or upload a file." });
      return;
    }
    const parsed = parseJsonText(pasteJson);
    if (!parsed) {
      setErrors({ questions: "JSON not recognized. Expect an array of question objects or { questions: [...] }." });
      return;
    }
    setQuestions(parsed);
  };

  // Validate before submit
  const validateBeforeSubmit = (): boolean => {
    const e: typeof errors = {};
    if (!moduleId) e.module = "Please select a module.";
    if (!submoduleId) e.submodule = "Please select a submodule.";
    if (!questions || !questions.length) e.questions = "No questions provided. Upload file or paste JSON.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setMessage(null);
    if (!validateBeforeSubmit()) return;

    setSubmitting(true);
    try {
      // Build payload
      const payload = {
        moduleId,
        submoduleId,
        quiz: {
          createdAt: new Date().toISOString(),
          questions: questions.map((q) => ({
            question: q.question,
            options: q.options ?? [], // ensure array
            answer: q.answer ?? null,
            explanation: q.explanation ?? null,
            marks: typeof q.marks === "number" ? q.marks : 1,
          })),
        },
      };

      const res = await fetch("/api/superadmin/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const json = await res.json().catch(() => ({}));
        setMessage({ type: "success", text: json.message || "Quiz created successfully." });
        // reset form
        setFileName("");
        setPasteJson("");
        setQuestions([]);
      } else {
        let err = `Server ${res.status}`;
        try {
          const j = await res.json();
          err = j.error || j.message || JSON.stringify(j);
        } catch {}
        setMessage({ type: "error", text: `Server error: ${err}` });
      }
    } catch (err) {
      const errorMsg = typeof err === "object" && err !== null && "message" in err ? String((err as any).message) : String(err);
      setMessage({ type: "error", text: `Network error: ${errorMsg}` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="cm-root">
      <div className="cm-card" style={{ maxWidth: 900 }}>
        <div className="cm-header">
          <div>
            <h3 className="cm-title">Create Quiz</h3>
            <p className="cm-sub">Upload questions via JSON or Excel and assign to Module/Submodule</p>
          </div>
          <div className="cm-header-badge">Administration</div>
        </div>

        <form className="cm-form" onSubmit={handleSubmit} noValidate>
          <label className="cm-label">
            Module
            <select
              className={`cm-input ${errors.module ? "cm-input-error" : ""}`}
              value={moduleId}
              onChange={(e) => setModuleId(e.target.value)}
              disabled={loadingModules}
            >
              <option value="">{loadingModules ? "Loading modules…" : "Select a module"}</option>
              {modules.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
            {errors.module && <div className="cm-error">{errors.module}</div>}
          </label>

          <label className="cm-label">
            Submodule
            <select
              className={`cm-input ${errors.submodule ? "cm-input-error" : ""}`}
              value={submoduleId}
              onChange={(e) => setSubmoduleId(e.target.value)}
              disabled={!moduleId || loadingSubmodules}
            >
              <option value="">{!moduleId ? "Choose a module first" : loadingSubmodules ? "Loading submodules…" : "Select a submodule"}</option>
              {submodules.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {errors.submodule && <div className="cm-error">{errors.submodule}</div>}
          </label>

          <div style={{ display: "grid", gap: 8 }}>
            <label className="cm-label">
              Paste JSON (array of questions) — OR upload a file (.json, .xls, .xlsx, .csv)
              <textarea
                className={`cm-input`}
                rows={6}
                value={pasteJson}
                onChange={(e) => setPasteJson(e.target.value)}
                placeholder='e.g. [{"question":"Q1","options":["a","b","c","d"],"answer":"a"}, ...]'
                disabled={submitting}
                style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" }}
              />
            </label>

            <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 4 }}>
              <input
                id="quiz-file-input"
                type="file"
                accept=".json,.xls,.xlsx,.csv"
                onChange={(e) => handleFile(e.target.files && e.target.files[0] ? e.target.files[0] : null)}
                disabled={submitting}
              />
              <button
                type="button"
                className="cm-btn ghost"
                onClick={handlePasteJson}
                disabled={submitting}
                title="Parse pasted JSON"
              >
                Parse Pasted JSON
              </button>

              <div style={{ color: "#6b7280", fontSize: 13 }}>
                {fileName ? `Selected: ${fileName}` : "No file selected"}
              </div>
            </div>

            {errors.questions && <div className="cm-error">{errors.questions}</div>}
          </div>

          {/* Preview */}
          <div style={{ marginTop: 4 }}>
            <h4 style={{ margin: "6px 0 8px 0", fontSize: 15 }}>Preview ({questions.length})</h4>
            <div style={{ maxHeight: 220, overflow: "auto", padding: 8, borderRadius: 10, border: "1px solid #eef2ff", background: "#fbfcfe" }}>
              {questions.length === 0 && (
                <div style={{ color: "#6b7280", fontSize: 13 }}>No questions parsed yet. Paste JSON or upload a file.</div>
              )}
              {questions.map((q, idx) => (
                <div key={idx} style={{ marginBottom: 10, paddingBottom: 6, borderBottom: "1px solid rgba(15,23,42,0.04)" }}>
                  <div style={{ fontWeight: 600 }}>{idx + 1}. {q.question}</div>
                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <ol style={{ marginTop: 6, marginBottom: 6 }}>
                      {q.options.map((o, i) => (
                        <li key={i} style={{ fontSize: 13 }}>{o}</li>
                      ))}
                    </ol>
                  )}
                  <div style={{ fontSize: 13, color: "#6b7280" }}>Answer: <span style={{ color: "#0f172a", fontWeight: 600 }}>{String(q.answer ?? "")}</span></div>
                  {q.explanation && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Explanation: {q.explanation}</div>}
                </div>
              ))}
            </div>
          </div>

          <div className="cm-actions" style={{ marginTop: 12 }}>
            <button type="submit" className="cm-btn primary" disabled={submitting}>
              {submitting ? "Submitting…" : "Create Quiz"}
            </button>

            <button
              type="button"
              className="cm-btn ghost"
              onClick={() => {
                setPasteJson("");
                setFileName("");
                setQuestions([]);
                setMessage(null);
                setErrors({});
              }}
              disabled={submitting}
            >
              Reset
            </button>
          </div>
        </form>

        {message && <div className={`cm-toast ${message.type === "success" ? "success" : "error"}`} style={{ marginTop: 12 }}>{message.text}</div>}

        <div className="cm-hint" style={{ marginTop: 12 }}>
          Example expected JSON schema: <code style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, monospace" }}>
            {'[{"question":"...","options":["a","b","c"],"answer":"a","explanation":"..."}]'}
          </code>
        </div>
      </div>
    </div>
  );
}
