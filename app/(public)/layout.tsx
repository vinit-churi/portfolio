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
      <main id="main" className="pt-16 md:pt-20 min-h-[60vh]">{children}</main>
      <Footer />
    </>
  );
}
