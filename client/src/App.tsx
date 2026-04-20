// MyShape — Application Router
// Design: Tech-Luxe Émeraude | Playfair Display + DM Sans
// Routes: /, /essayer, /morphologies, /lunettes, /a-propos

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CustomCursor from "./components/CustomCursor";
import LoadingScreen from "./components/LoadingScreen";
import Home from "./pages/Home";
import Essayer from "./pages/Essayer";
import EssayerV2 from "./pages/EssayerV2";
import Morphologies from "./pages/Morphologies";
import Lunettes from "./pages/Lunettes";
import APropos from "./pages/APropos";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/essayer" component={Essayer} />
      <Route path="/essayer-v2" component={EssayerV2} />
      <Route path="/morphologies" component={Morphologies} />
      <Route path="/lunettes" component={Lunettes} />
      <Route path="/a-propos" component={APropos} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <LoadingScreen />
        <CustomCursor />
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
