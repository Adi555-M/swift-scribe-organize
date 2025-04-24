import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotes } from "@/contexts/NotesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, ChevronLeft, X, Check, Copy } from "lucide-react";
import { Trash } from "lucide-react";
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

  // Copy note content to clipboard
  const handleCopy = () => {
    if (!content) return;
    navigator.clipboard.writeText(content);
    toast("Note content copied to clipboard");
  };

  // Modify the performSearch function to highlight matches
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
      
      // Set cursor and scroll to the first match
      textarea.focus();
      textarea.setSelectionRange(firstMatchPosition, firstMatchPosition + searchText.length);
      
      const textUpToMatch = content.substring(0, firstMatchPosition);
      const lineCount = (textUpToMatch.match(/\n/g) || []).length;
      const lineHeight = 24;
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
    <div className="min-h-screen flex flex-col bg-white sm:max-w-md sm:mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
        <div className="text-xl font-bold mb-2">Edit Note</div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/")}
              className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
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
                  aria-label="Copy note"
                >
                  <Copy size={24} />
                </button>
                <button
                  onClick={() => setIsSearching(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Search in note"
                >
                  <Search size={24} />
                </button>
                <Button 
                  onClick={handleSave}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                >
                  <Check size={20} />
                  <span>Save</span>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search UI */}
      {isSearching && (
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
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
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-600">
                {currentMatchIndex + 1} of {searchMatches.length} matches
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextMatch}
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Note Content */}
      <div className="flex-1 px-4 py-3 flex flex-col gap-4">
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
          className="text-xl font-bold focus-visible:ring-2"
        />
        
        <Textarea
          ref={contentRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start writing..."
          className="flex-1 min-h-[calc(100vh-300px)] text-lg resize-none focus-visible:ring-2"
          style={{
            backgroundColor: "white",
            caretColor: searchMatches.length > 0 ? "#3b82f6" : "auto"
          }}
        />
      </div>

      {/* Delete button */}
      <div className="fixed bottom-20 w-full px-4 py-3 bg-white border-t border-gray-200">
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center p-3 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          aria-label="Delete note"
        >
          <Trash size={24} />
        </button>
      </div>
    </div>
  );
};

export default NoteDetailPage;
