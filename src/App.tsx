import { Route, Switch, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Cadastro from "@/pages/Cadastro";
import Dashboard from "@/pages/Dashboard";
import CoordenadorDashboard from "@/pages/CoordenadorDashboard";
import ProfessorDashboard from "@/pages/ProfessorDashboard";
import Financeiro from "@/pages/Financeiro";
import Documentacao from "@/pages/Documentacao";
import Alimentacao from "@/pages/Alimentacao";
import { Toaster as HotToaster } from "react-hot-toast";

function Router() {
  const [location, setLocation] = useLocation();

  // Ensure we're always starting at the home page when the app loads
  useEffect(() => {
    // If we're at the root path that's empty or just "/", ensure home component renders
    if (location === "" || location === "/") {
      console.log("Application loaded at home page");
    } else if (location === "/blank" || location === "/index.html") {
      // Handle cases where it might load into blank or index
      setLocation("/");
    }
  }, [location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cadastro" component={Cadastro} />
      <Route path="/dashboard/diretor" component={Dashboard} />
      <Route path="/dashboard/coordenador" component={CoordenadorDashboard} />
      <Route path="/dashboard/professor" component={ProfessorDashboard} />
      <Route path="/financeiro" component={Financeiro} />
      <Route path="/documentacao" component={Documentacao} />
      <Route path="/alimentacao" component={Alimentacao} />
      {/* Fallback for unknown routes - redirect to home */}
      <Route>
        {() => {
          useEffect(() => {
            // Redirect to home for any unmatched route
            console.log("Unmatched route, redirecting to home");
            setLocation("/");
          }, []);
          return null;
        }}
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
        <HotToaster position="top-right" />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
