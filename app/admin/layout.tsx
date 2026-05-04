import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (token !== process.env.ADMIN_SECRET) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-white/5 px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="font-mono text-xs text-outline uppercase tracking-widest">
            Portfolio CMS
          </span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/"
            target="_blank"
            className="text-[10px] font-mono text-outline hover:text-white transition-colors uppercase tracking-widest"
          >
            View Site
          </a>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-8 py-10">{children}</main>
    </div>
  );
}

function LogoutButton() {
  return (
    <form
      action={async () => {
        "use server";
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        cookieStore.delete("admin_token");
        const { redirect } = await import("next/navigation");
        redirect("/admin/login");
      }}
    >
      <button
        type="submit"
        className="text-[10px] font-mono text-outline hover:text-red-400 transition-colors uppercase tracking-widest"
      >
        Logout
      </button>
    </form>
  );
}
