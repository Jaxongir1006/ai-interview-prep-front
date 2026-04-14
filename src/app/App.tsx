import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "./components/ui/sonner";
import GlobalApiErrorHandler from "./components/GlobalApiErrorHandler";

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="interview-platform-theme">
      <GlobalApiErrorHandler />
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
