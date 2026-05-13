import AuthForm from "@/components/AuthForm";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-stone-50 px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-stone-900">
          Sign in
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Welcome back to Serene Stay
        </p>
        <div className="mt-8">
          <AuthForm />
        </div>
      </div>
    </main>
  );
}
