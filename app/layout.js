import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import PerformanceMonitor from "./components/PerformanceMonitor";

export const metadata = {
  title: "IceComm - Your Trusted Online Marketplace",
  description: "Shop the best products with fast delivery and excellent customer service",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <PerformanceMonitor />
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
