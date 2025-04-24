
import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotes } from "@/contexts/NotesContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Search, ChevronLeft, X, Check, Copy, Trash2 } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={28} />
          </button>
          <h1 className="text-2xl font-bold">
            {isSearching ? "Search" : "Edit Note"}
          </h1>
        </div>
        
        <div className="flex items-center gap-3">
          {isSearching ? (
            <button
              onClick={() => {
                setIsSearching(false);
                setSearchText("");
                setSearchMatches([]);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={28} />
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
                <Search size={28} />
              </button>
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 text-lg font-medium hover:bg-blue-600 transition-colors"
              >
                <Check size={24} />
                <span>Save</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search UI */}
      {isSearching && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Search in note..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="flex-1 text-lg h-12"
              autoFocus
            />
            <Button 
              onClick={performSearch}
              className="text-lg h-12 px-8"
            >
              Search
            </Button>
          </div>
          
          {searchMatches.length > 0 && (
            <div className="flex justify-between items-center mt-3 text-base">
              <span className="text-gray-600">
                {currentMatchIndex + 1} of {searchMatches.length} matches
              </span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={goToNextMatch}
                className="text-base"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Note Content */}
      <div className="flex-1 px-6 py-4 flex flex-col gap-6">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-700">Title</label>
          <Input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title"
            className="text-2xl font-bold border rounded-lg p-4 focus-visible:ring-2"
          />
        </div>
        
        <div className="flex-1 space-y-2">
          <label htmlFor="content" className="text-sm font-medium text-gray-700">Content</label>
          <Textarea
            id="content"
            ref={contentRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="flex-1 min-h-[calc(100vh-300px)] text-lg p-4 rounded-lg border resize-none focus-visible:ring-2"
          />
        </div>
      </div>

      {/* Delete button at bottom */}
      <div className="fixed bottom-20 w-full px-6 py-4 bg-white border-t border-gray-200">
        <button
          onClick={handleDelete}
          className="w-full flex items-center justify-center gap-2 py-3 text-red-500 hover:bg-red-50 rounded-lg text-lg font-medium transition-colors"
        >
          <Trash2 size={24} />
          <span>Delete Note</span>
        </button>
      </div>
    </div>
  );
};

export default NoteDetailPage;
