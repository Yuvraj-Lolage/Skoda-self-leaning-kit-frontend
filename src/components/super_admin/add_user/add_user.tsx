import React, { useState } from "react";
import type { FormEvent } from "react";
import axiosInstance from "../../../API/axios_instance";
import { ToastHelper } from "../../ui/toast_helper/toast";
import { Toaster } from "react-hot-toast";

type UserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  password: string;
};

type PasswordMode = "custom" | "generate";

/** Alphanumeric, avoiding easily confused pairs (0/O, 1/l). */
function generateReadablePassword(length = 8): string {
  const chars =
    "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const out: string[] = [];
  const buf = new Uint32Array(length);
  crypto.getRandomValues(buf);
  for (let i = 0; i < length; i++) {
    out.push(chars[buf[i] % chars.length]);
  }
  return out.join("");
}

const displayName = (f: UserPayload) =>
  [f.firstName.trim(), f.lastName.trim()].filter(Boolean).join(" ").trim();

const AddUser: React.FC = () => {
  const [form, setForm] = useState<UserPayload>({
    firstName: "",
    lastName: "",
    email: "",
    role: "User",
    password: "",
  });
  const [passwordMode, setPasswordMode] = useState<PasswordMode>("custom");
  const [submitting, setSubmitting] = useState(false);
  const [lastCreatedPassword, setLastCreatedPassword] = useState<string | null>(
    null
  );

  const update = (k: keyof UserPayload, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLastCreatedPassword(null);

    if (!form.firstName.trim() || !form.email.trim()) {
      ToastHelper.error("First name and email are required.");
      return;
    }

    let passwordToSend = form.password;
    if (passwordMode === "generate") {
      passwordToSend = generateReadablePassword(8);
    }

    if (!passwordToSend || passwordToSend.length < 8) {
      ToastHelper.error("Password must be at least 8 characters.");
      return;
    }

    const name = displayName(form);
    if (!name) {
      ToastHelper.error("Enter at least a first name.");
      return;
    }

    setSubmitting(true);
    try {
      const { data } = await axiosInstance.post<{
        message?: string;
        emailSent?: boolean;
      }>(
        "/user/super-admin/create",
        {
          name,
          email: form.email.trim().toLowerCase(),
          password: passwordToSend,
          role: form.role,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      ToastHelper.success(data?.message || "User created successfully.");
      if (data?.emailSent) {
        setLastCreatedPassword(null);
      } else {
        setLastCreatedPassword(passwordToSend);
      }
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        role: "User",
        password: "",
      });
    } catch (err: unknown) {
      const ax = err as {
        response?: { data?: { message?: string }; status?: number };
      };
      const msg =
        ax.response?.data?.message ||
        "Could not create user. You must be signed in as an administrator.";
      ToastHelper.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const copyPassword = async () => {
    if (!lastCreatedPassword) return;
    try {
      await navigator.clipboard.writeText(lastCreatedPassword);
      ToastHelper.success("Password copied to clipboard.");
    } catch {
      ToastHelper.error("Could not copy. Select and copy manually.");
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-1 sm:px-2">
      <Toaster />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl shadow-md border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            Add New User
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Administrators only. Share credentials securely with the new user.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              First name <span className="text-red-500">*</span>
            </label>
            <input
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              placeholder="First name"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm font-medium mb-1">
              Last name
            </label>
            <input
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="user@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-gray-600 text-sm font-medium mb-1">
            Role
          </label>
          <select
            className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
            value={form.role}
            onChange={(e) => update("role", e.target.value)}
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <fieldset className="rounded-xl border border-gray-200 p-4 space-y-3">
          <legend className="text-sm font-medium text-gray-700 px-1">
            Password
          </legend>
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="passwordMode"
                checked={passwordMode === "custom"}
                onChange={() => setPasswordMode("custom")}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">Custom password</span>
            </label>
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="passwordMode"
                checked={passwordMode === "generate"}
                onChange={() => setPasswordMode("generate")}
                className="text-purple-600 focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">
                Generate 8-character password
              </span>
            </label>
          </div>
          <p className="text-xs text-gray-500">
            Custom: you choose a strong password. Generate: a random 8-character
            password is created on submit—copy it and share it securely (email
            the user out of band or your org’s process). Minimum length is always
            8.
          </p>
          {passwordMode === "custom" && (
            <input
              type="password"
              className="w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 outline-none"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 8 characters"
              minLength={8}
              autoComplete="new-password"
            />
          )}
          {passwordMode === "generate" && (
            <p className="text-sm text-gray-600 italic">
              A new password will appear after you create the user so you can
              copy it once.
            </p>
          )}
        </fieldset>

        {lastCreatedPassword && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-2">
            <p className="text-sm font-medium text-green-800">
              One-time password (copy and share securely):
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <code className="flex-1 min-w-0 break-all rounded-lg bg-white px-3 py-2 text-sm text-gray-800 border border-green-100">
                {lastCreatedPassword}
              </code>
              <button
                type="button"
                onClick={copyPassword}
                className="shrink-0 px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:opacity-90"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 text-white rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg hover:opacity-90 transition disabled:opacity-60"
        >
          {submitting ? (
            <span className="inline-flex items-center justify-center gap-2">
              <svg
                className="animate-spin h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
                />
              </svg>
              Creating…
            </span>
          ) : (
            "Create user"
          )}
        </button>
          </form>
        </div>

        <aside className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-purple-50/90 via-white to-blue-50/80 p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-3">
              Before you create
            </h3>
            <ul className="space-y-3 text-sm text-gray-600 list-disc pl-5 marker:text-purple-500">
              <li>
                <span className="font-medium text-gray-700">User</span> — access
                to training and learner features.
              </li>
              <li>
                <span className="font-medium text-gray-700">Admin</span> —
                manage content, view org progress, and add users.
              </li>
              <li>
                Duplicate emails are rejected; the new user must log in with the
                password you set or generate.
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Password & email
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              After you create a user, <strong>login details are emailed</strong>{" "}
              to them when the server is configured for SMTP. If email is not
              configured or delivery fails, the password appears here so you can
              share it securely yourself.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AddUser;
