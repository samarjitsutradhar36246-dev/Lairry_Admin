import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useScrollContainer } from "./ScrollContext";

export default function ScrollToTop() {
  const { pathname } = useLocation();
  const mainRef = useScrollContainer();

useEffect(() => {
  const el = mainRef?.current;
  if (!el) return;

  // only exclude the main dashboard
  if (pathname === "/admin") return;

  // all other admin pages
  if (pathname.startsWith("/admin/")) {
    el.scrollTo({ top: 0, behavior: "auto" });
  }
}, [pathname,mainRef]);

  return null;
}