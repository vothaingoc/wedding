import type { Metadata } from "next";
import { headers } from "next/headers";
import { wedding } from "../src/config/wedding";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host");
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const siteUrl = host ? `${protocol}://${host}` : wedding.publicUrl;

  return {
    metadataBase: new URL(siteUrl),
    title: `${wedding.groomName} & ${wedding.brideName} Wedding Invitation`,
    description:
      "皆様にお越しいただけることが、私たち家族にとって何よりの光栄です。",
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      type: "website",
      url: siteUrl,
      title: `${wedding.groomName} & ${wedding.brideName} Wedding Invitation`,
      description:
        "皆様にお越しいただけることが、私たち家族にとって何よりの光栄です。",
      images: [
        {
          url: wedding.ogImage,
          width: 1200,
          height: 630,
          alt: "Wedding Invitation・お招き状・Thiệp mời",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${wedding.groomName} & ${wedding.brideName} Wedding Invitation`,
      description:
        "皆様にお越しいただけることが、私たち家族にとって何よりの光栄です。",
      images: [wedding.ogImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
