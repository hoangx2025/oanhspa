import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatChatButtons from "@/components/FloatChatButtons";
import { OrganizationJsonLd } from "@/components/JsonLd";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <OrganizationJsonLd />
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <FloatChatButtons />
    </>
  );
}
