import type { Metadata, Viewport } from "next";
import { Great_Vibes, Cormorant_Garamond, Marcellus } from "next/font/google";
import { invitation } from "@/data/invitation";
import { coupleNames } from "@/lib/name";
import { formatLongDate, TIME_ZONE } from "@/lib/date";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-great-vibes",
});

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-cormorant",
});

const marcellus = Marcellus({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-marcellus",
});

const names = coupleNames(invitation.bride, invitation.groom);
const dateLabel = formatLongDate(invitation.weddingDate);

/** Set NEXT_PUBLIC_SITE_URL at deploy time so OG images resolve absolutely. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: `${names} | ${dateLabel}`,
  description: `You are warmly invited to the wedding of ${names} at ${invitation.venue.name}, ${dateLabel}.`,
  openGraph: {
    title: `${names} | ${dateLabel}`,
    description: `You are warmly invited to the wedding of ${names} at ${invitation.venue.name}.`,
    type: "website",
    images: [
      {
        url: "/images/gallery-3.png",
        width: 1303,
        height: 670,
        alt: names,
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#141021",
  width: "device-width",
  initialScale: 1,
  // Zoom stays available — never trap a guest who needs to enlarge text.
  maximumScale: 5,
  viewportFit: "cover",
};

/** Search engines and calendars read the ceremony straight off the page. */
const eventSchema = {
  "@context": "https://schema.org",
  "@type": "Event",
  name: `The wedding of ${names}`,
  startDate: invitation.weddingDate,
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: invitation.venue.name,
    address: invitation.venue.address,
  },
  organizer: { "@type": "Person", name: names },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-timezone={TIME_ZONE}
      className={`${greatVibes.variable} ${cormorant.variable} ${marcellus.variable}`}
    >
      <body>
        {children}
        <script
          type="application/ld+json"
          // Serialised from our own data — no guest input reaches this.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventSchema) }}
        />
      </body>
    </html>
  );
}
