import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeProvider from "./common/theme-provider";
import { TooltipProvider } from "./common/ui/tooltip";
import { registerLicense } from "@syncfusion/ej2-base";

const queryClient = new QueryClient();

// Registering Syncfusion license key
registerLicense(import.meta.env.VITE_SYNCFUSION_EJ2_LICENSE_KEY);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <TooltipProvider delayDuration={0}>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>,
);
