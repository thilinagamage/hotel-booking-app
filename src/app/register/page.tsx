import AuthForm from "@/components/AuthForm";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          Create account
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Join Serene Stay for a calm booking experience
        </p>
        <div className="mt-8">
          <AuthForm />
        </div>
      </div>
    </main>
  );
}
