import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>
      <NavBar />
      <main id="main" className="pt-24 min-h-[calc(100vh-3.5rem)]">{children}</main>
      <Footer />
    </>
  );
}
