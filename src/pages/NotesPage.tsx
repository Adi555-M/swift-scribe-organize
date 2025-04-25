import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "@/contexts/NotesContext";
import NoteCard from "@/components/NoteCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Trash, Brain } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ReactNode } from "react";
import FloatingActionButton from "@/components/FloatingActionButton";

const NotesPage = () => {
  const { notes, addNote } = useNotes();
  const navigate = useNavigate();
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddNote = () => {
    if (newNoteTitle.trim()) {
      addNote({
        title: newNoteTitle,
        content: newNoteContent,
      });
      setNewNoteTitle("");
      setNewNoteContent("");
      setShowAddNote(false);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlightSearchText = (text: string): ReactNode => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === searchQuery.toLowerCase() 
        ? <span key={i} className="bg-blue-100 text-blue-900">{part}</span>
        : part
    );
  };

  return (
    <div className="pb-20 px-4 pt-4 relative min-h-screen">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Notes</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => {}}
            >
              <Brain className="h-5 w-5 text-gray-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => {}}
            >
              <Trash className="h-5 w-5 text-gray-600" />
            </Button>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white border border-gray-200 rounded-xl h-10"
          />
        </div>
      </div>

      {showAddNote ? (
        <div className="mb-4 p-4 bg-white rounded-xl border border-gray-200 shadow-sm animate-slide-in-bottom mt-4">
          <Input
            type="text"
            placeholder="Note title"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="w-full p-2 text-lg font-medium focus:outline-none mb-3 border-0 border-b border-gray-200"
            autoFocus
          />
          <Textarea
            placeholder="Note content..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            className="w-full mt-2 mb-4 border-0 resize-none"
            rows={4}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowAddNote(false)}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddNote}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Add
            </Button>
          </div>
        </div>
      ) : null}

      {filteredNotes.length === 0 && !showAddNote ? (
        <div className="text-center py-12 text-gray-500">
          <p>No notes found. Create your first note!</p>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              onClick={() => navigate(`/note/${note.id}`)}
              className="cursor-pointer"
            >
              <NoteCard
                note={{
                  ...note,
                  titleNode: highlightSearchText(note.title),
                  contentNode: highlightSearchText(note.content)
                }}
              />
            </div>
          ))}
        </div>
      )}

      <FloatingActionButton onClick={() => setShowAddNote(true)} />
    </div>
  );
};

export default NotesPage;
