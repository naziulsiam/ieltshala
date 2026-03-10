import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import AuthCallback from "./pages/AuthCallback";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import ListeningPractice from "./pages/ListeningPractice";
import ReadingPractice from "./pages/ReadingPractice";
import MockTests from "./pages/MockTests";
import Vocabulary from "./pages/Vocabulary";
import Profile from "./pages/Profile";
import WritingPractice from "./pages/WritingPractice";
import SpeakingPractice from "./pages/SpeakingPractice";
import AppLayout from "./components/app/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/practice/writing" element={<WritingPractice />} />
              <Route path="/practice/speaking" element={<SpeakingPractice />} />
              <Route path="/practice/listening" element={<ListeningPractice />} />
              <Route path="/practice/reading" element={<ReadingPractice />} />
              <Route path="/practice" element={<Practice />} />
              <Route path="/mock-tests" element={<MockTests />} />
              <Route path="/vocabulary" element={<Vocabulary />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
