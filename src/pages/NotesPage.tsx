
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNotes } from "@/contexts/NotesContext";
import NoteCard from "@/components/NoteCard";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const NotesPage = () => {
  const { notes, addNote } = useNotes();
  const navigate = useNavigate();
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddNote = () => {
    if (newNoteTitle.trim()) {
      addNote({
        title: newNoteTitle,
        content: "",
      });
      setNewNoteTitle("");
      setShowAddNote(false);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="pb-20 px-4 pt-4">
      <h1 className="text-3xl font-bold mb-4">My Notes</h1>
      
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input
          type="text"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white border border-gray-200"
        />
      </div>

      {showAddNote ? (
        <div className="mb-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm animate-slide-in-bottom">
          <input
            type="text"
            placeholder="Note title"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            className="w-full p-2 border-b border-gray-200 text-lg font-medium focus:outline-none focus:border-primary mb-2"
            autoFocus
          />
          <div className="flex justify-end gap-2 mt-3">
            <button
              onClick={() => setShowAddNote(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleAddNote}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Add
            </button>
          </div>
        </div>
      ) : null}

      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No notes found. Create your first note!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={() => navigate(`/note/${note.id}`)}
            />
          ))}
        </div>
      )}

      <FloatingActionButton onClick={() => setShowAddNote(true)} />
    </div>
  );
};

export default NotesPage;
