import "./globals.css";

// The <html> element is rendered by src/app/[locale]/layout.tsx.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return children;
}
