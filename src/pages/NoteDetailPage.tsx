
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotes } from "@/contexts/NotesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, ChevronLeft, X, Check } from "lucide-react";
import { toast } from "sonner";

const NoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { getNote, updateNote, deleteNote } = useNotes();
  const note = getNote(id || "");
  const navigate = useNavigate();

  // State for managing note data
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  
  // State for search functionality
  const [isSearching, setIsSearching] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchMatches, setSearchMatches] = useState<number[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
  
  const contentRef = useRef<HTMLTextAreaElement>(null);

  // Redirect if note doesn't exist
  useEffect(() => {
    if (!note) navigate("/");
  }, [note, navigate]);

  // Save note changes
  const handleSave = () => {
    if (!id) return;
    
    updateNote(id, {
      title,
      content,
    });
    
    toast("Note saved successfully");
    navigate("/");
  };

  // Delete note
  const handleDelete = () => {
    if (!id) return;
    
    deleteNote(id);
    toast("Note deleted");
    navigate("/");
  };

  // Search functionality
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
    
    // Scroll to the first match and set cursor position
    if (matches.length > 0 && contentRef.current) {
      const textarea = contentRef.current;
      const firstMatchPosition = matches[0];
      
      // Set cursor at the beginning of the first match
      textarea.focus();
      textarea.setSelectionRange(firstMatchPosition, firstMatchPosition);
      
      // Get the text up to the match
      const textUpToMatch = content.substring(0, firstMatchPosition);
      
      // Count newlines to calculate vertical position
      const lineCount = (textUpToMatch.match(/\n/g) || []).length;
      
      // Approximate line height (adjust as needed)
      const lineHeight = 24;
      
      // Scroll to the appropriate position
      textarea.scrollTop = lineHeight * lineCount;
    }
  };

  // Navigate to next search match
  const goToNextMatch = () => {
    if (searchMatches.length === 0) return;
    
    const nextIndex = (currentMatchIndex + 1) % searchMatches.length;
    setCurrentMatchIndex(nextIndex);
    
    if (contentRef.current) {
      const matchPosition = searchMatches[nextIndex];
      const textarea = contentRef.current;
      
      textarea.focus();
      textarea.setSelectionRange(matchPosition, matchPosition);
      
      // Same scrolling logic as above
      const textUpToMatch = content.substring(0, matchPosition);
      const lineCount = (textUpToMatch.match(/\n/g) || []).length;
      const lineHeight = 24;
      textarea.scrollTop = lineHeight * lineCount;
    }
  };

  // Highlight search matches in content
  const highlightMatches = () => {
    if (!searchText || searchMatches.length === 0) {
      return content;
    }

    // This will be handled by CSS, we're just displaying the regular content in the textarea
    return content;
  };

  if (!note) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2"
          >
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-semibold ml-2">
            {isSearching ? "Search" : "Edit Note"}
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          {isSearching ? (
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchText("");
                setSearchMatches([]);
              }}
              className="p-2"
            >
              <X size={24} />
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsSearching(true)}
                className="p-2"
              >
                <Search size={24} />
              </button>
              <button
                onClick={handleSave}
                className="bg-primary text-white px-6 py-2 rounded-md flex items-center gap-2"
              >
                <Check size={18} />
                <span>Save</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search UI */}
      {isSearching && (
        <div className="p-4 border-b border-gray-200 bg-gray-50 animate-slide-in-top">
          <div className="flex gap-2 mb-2">
            <Input
              type="text"
              placeholder="Search in this note..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button onClick={performSearch}>Search</Button>
          </div>
          
          {searchMatches.length > 0 && (
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">
                {currentMatchIndex + 1} of {searchMatches.length} matches
              </span>
              <Button variant="outline" size="sm" onClick={goToNextMatch}>
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Note Content */}
      <div className="flex-1 p-4 flex flex-col gap-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-xl font-bold border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
        />
        
        <Textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="flex-1 resize-none min-h-[70vh] border-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {/* Delete button at bottom */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <Button 
          variant="outline" 
          className="w-full text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          onClick={handleDelete}
        >
          Delete Note
        </Button>
      </div>
    </div>
  );
};

export default NoteDetailPage;
