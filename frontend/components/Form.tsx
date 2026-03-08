export default function Form({onSubmit, page}: {onSubmit: (e: React.FormEvent<HTMLFormElement>) => void, page: "login" | "register"}) {
  return (
    <form onSubmit={ onSubmit} className="flex flex-col gap-2 max-w-3xl">
      <input type="text" placeholder="Username..." name="username" />
      <input type="password" placeholder="Password..." name="password" />
      <button type="submit">{page === "login" ? "Login" : "Register"}</button>
    </form>
  );
}
