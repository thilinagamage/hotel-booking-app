"use client";

import { useActionState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signup, login } from "@/actions/auth";

type AuthErrors = {
  name?: string[];
  email?: string[];
  password?: string[];
};

export default function AuthForm() {
  const pathname = usePathname();
  const isRegister = pathname === "/register";
  const action = isRegister ? signup : login;

  const [state, formAction, pending] = useActionState(action, undefined);

  const errors = state as { errors?: AuthErrors } | undefined;

  return (
    <form action={formAction} className="space-y-5">
      {isRegister && (
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-stone-700"
          >
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            className="mt-1 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
          />
          {errors?.errors?.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.errors.name[0]}
            </p>
          )}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-stone-700"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="mt-1 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
        />
        {errors?.errors?.email && (
          <p className="mt-1 text-sm text-red-600">
            {errors.errors.email[0]}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-stone-700"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete={isRegister ? "new-password" : "current-password"}
          className="mt-1 w-full rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 outline-none transition focus:border-stone-500"
        />
        {errors?.errors?.password && (
          <p className="mt-1 text-sm text-red-600">
            {errors.errors.password[0]}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-2xl bg-stone-900 px-5 py-3.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending
          ? "Please wait..."
          : isRegister
            ? "Create account"
            : "Sign in"}
      </button>

      <p className="text-center text-sm text-stone-600">
        {isRegister ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-stone-900 underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-stone-900 underline"
            >
              Create one
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
