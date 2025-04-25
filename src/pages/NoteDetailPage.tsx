
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotes } from "@/contexts/NotesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, ChevronLeft, X, Check, Copy, Trash } from "lucide-react";
import { toast } from "sonner";

const NoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getNote, updateNote, deleteNote } = useNotes();
  const note = getNote(id || "");
  const navigate = useNavigate();
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchMatches, setSearchMatches] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!note) navigate("/");
  }, [note, navigate]);

  const handleSave = () => {
    if (!id) return;
    updateNote(id, { title, content });
    toast("Note saved successfully");
    navigate("/");
  };

  const handleDelete = () => {
    if (!id) return;
    deleteNote(id);
    toast("Note deleted");
    navigate("/");
  };

  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast("Note content copied to clipboard");
  };

  const performSearch = () => {
    if (!searchText || !content) {
      setSearchMatches([]);
      return;
    }

    const text = content.toLowerCase();
    const searchLower = searchText.toLowerCase();
    const matches: number[] = [];
    let index = 0;

    while (index < text.length) {
      const foundIndex = text.indexOf(searchLower, index);
      if (foundIndex === -1) break;
      matches.push(foundIndex);
      index = foundIndex + 1;
    }

    setSearchMatches(matches);
    setCurrentMatchIndex(matches.length > 0 ? 0 : -1);

    if (matches.length > 0 && contentRef.current) {
      const textarea = contentRef.current;
      const firstMatchPosition = matches[0];
      textarea.focus();
      textarea.setSelectionRange(firstMatchPosition, firstMatchPosition + searchText.length);
    }
  };

  const goToNextMatch = () => {
    if (searchMatches.length === 0) return;
    const nextIndex = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIndex);
    
    if (contentRef.current) {
      const matchPosition = searchMatches[nextIndex];
      contentRef.current.focus();
      contentRef.current.setSelectionRange(
        matchPosition,
        matchPosition + searchText.length
      );
    }
  };

  if (!note) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-xl font-semibold">Edit Note</h1>
          </div>
          
          <div className="flex items-center gap-2">
            {isSearching ? (
              <button
                onClick={() => {
                  setIsSearching(false);
                  setSearchText("");
                  setSearchMatches([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={24} />
              </button>
            ) : (
              <>
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Copy size={24} />
                </button>
                <button
                  onClick={() => setIsSearching(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <Search size={24} />
                </button>
                <Button 
                  onClick={handleSave}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Check size={20} />
                  <span>Save</span>
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Search bar */}
        {isSearching && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Search in note..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="flex-1"
                autoFocus
              />
              <Button 
                onClick={performSearch}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Search
              </Button>
            </div>
            {searchMatches.length > 0 && (
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-gray-600">
                  {currentMatchIndex + 1} of {searchMatches.length} matches
                </span>
                <Button variant="outline" size="sm" onClick={goToNextMatch}>
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Note Content */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-xl font-semibold focus-visible:ring-2"
        />
        
        <Textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="flex-1 min-h-[calc(100vh-300px)] text-base resize-none focus-visible:ring-2"
          style={{
            backgroundColor: "white",
          }}
        />
      </div>

      {/* Delete button */}
      <div className="fixed bottom-20 right-4 z-10">
        <button
          onClick={handleDelete}
          className="p-3 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
          aria-label="Delete note"
        >
          <Trash className="w-6 h-6 text-red-500" />
        </button>
      </div>
    </div>
  );
};

export default NoteDetailPage;
