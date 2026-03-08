import Link from "next/link";

export default function Form({onSubmit, page}: {onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, page: "login" | "register"}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 w-full">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter your username"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 mt-2"
      >
        {page === "login" ? "Sign In" : "Create Account"}
      </button>
      <p className="text-center text-sm text-gray-500 mt-2">
        {page === "login" ? (
          <>Don&apos;t have an account?{" "}<Link href="/register" className="text-blue-600 hover:underline font-medium">Sign up</Link></>
        ) : (
          <>Already have an account?{" "}<Link href="/login" className="text-blue-600 hover:underline font-medium">Sign in</Link></>
        )}
      </p>
    </form>
  );
}
