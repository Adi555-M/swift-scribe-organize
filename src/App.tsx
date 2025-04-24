
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NotesProvider } from "@/contexts/NotesContext";
import { TasksProvider } from "@/contexts/TasksContext";
import Index from "./pages/Index";
import NotesPage from "./pages/NotesPage";
import TasksPage from "./pages/TasksPage";
import NoteDetailPage from "./pages/NoteDetailPage";
import NotFound from "./pages/NotFound";
import BottomNavBar from "./components/BottomNavBar";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <NotesProvider>
        <TasksProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                <Route path="/" element={<NotesPage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/note/:id" element={<NoteDetailPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <BottomNavBar />
            </div>
          </BrowserRouter>
        </TasksProvider>
      </NotesProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
