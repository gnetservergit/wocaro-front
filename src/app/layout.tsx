import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/assets/sass/style.scss";
import BootstrapProvider from "@/component/BootstrapProvider";
import Footer from "@/component/common/Footer";
import { getMetadataBase } from "@/lib/paths";

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "Wocaro",
  description: "Wocaro Next.js + WordPress Theme",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head></head>
      <body>
        <BootstrapProvider>
          {children}
          <Footer />
        </BootstrapProvider>
      </body>
    </html>
  );
}
