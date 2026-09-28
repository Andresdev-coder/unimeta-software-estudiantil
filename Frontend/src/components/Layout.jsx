import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Layout({ title, children }) {
  return (
    <div className="flex min-h-screen min-w-0 bg-slate-50 dark:bg-slate-900">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="min-w-0 flex-1 px-4 py-4 pb-24 sm:p-6 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
