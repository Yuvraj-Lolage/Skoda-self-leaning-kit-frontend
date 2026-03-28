import React, { useState } from "react";
import type { FormEvent } from "react";

type UserPayload = {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    password: string;
};

const AddUser: React.FC = () => {
    const [form, setForm] = useState<UserPayload>({
        firstName: "",
        lastName: "",
        email: "",
        role: "user",
        password: "",
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const update = (k: keyof UserPayload, v: string) =>
        setForm((s) => ({ ...s, [k]: v }));

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setError(null);

        if (!form.firstName || !form.email || !form.password) {
            setError("Please fill required fields: first name, email, password.");
            return;
        }

        setSubmitting(true);
        try {
            // Replace endpoint with your backend route
            const res = await fetch("/api/super-admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const body = await res.json().catch(() => ({}));
                throw new Error(body.message || `Request failed: ${res.status}`);
            }

            setMessage("User created successfully.");
            setForm({ firstName: "", lastName: "", email: "", role: "user", password: "" });
        } catch (err: any) {
            setError(err.message || "An error occurred.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: 480 }}>
            <h3>Add New User (Super Admin)</h3>

            <label>
                First name*
                <input
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    required
                />
            </label>

            <label>
                Last name
                <input
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                />
            </label>

            <label>
                Email*
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    required
                />
            </label>

            <label>
                Role
                <select value={form.role} onChange={(e) => update("role", e.target.value)}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                </select>
            </label>

            <label>
                Password*
                <input
                    type="password"
                    value={form.password}
                    onChange={(e) => update("password", e.target.value)}
                    required
                />
            </label>

            <div style={{ marginTop: 12 }}>
                <button type="submit" disabled={submitting}>
                    {submitting ? "Creating..." : "Create User"}
                </button>
            </div>

            {message && <div style={{ color: "green", marginTop: 8 }}>{message}</div>}
            {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        </form>
    );
};

export default AddUser;