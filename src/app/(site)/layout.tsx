import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatChatButtons from "@/components/FloatChatButtons";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex-1">
        {children}
        <FloatChatButtons />
      </main>
      <Footer />
    </>
  );
}
