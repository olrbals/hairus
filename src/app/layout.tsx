import type { Metadata, Viewport } from "next";
import "@fontsource-variable/cormorant-garamond";
import "@fontsource-variable/cormorant";
import "./globals.css";
import "../styles/prototype.css";
import "../styles/primary-cta.css";
import {PrototypeProvider} from "@/components/prototype/store";
import {BottomNavProvider} from "@/components/bottom-nav";
import {GlassTopButton} from "@/components/glass-top-button";
export const metadata: Metadata = { title: "HAIRUS", description: "나의 헤어를 이해하고 취향을 발견하는 HAIRUS 모바일 프로토타입" };
export const viewport: Viewport = { width: "device-width", initialScale: 1, viewportFit: "cover" };
export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) { return <html lang="ko"><body><a className="skip-link" href="#main">본문으로 이동</a><div className="mobile-shell"><PrototypeProvider><BottomNavProvider>{children}<GlassTopButton/></BottomNavProvider></PrototypeProvider></div></body></html>; }
