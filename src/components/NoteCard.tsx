
import { Note } from "@/types";
import { formatDate } from "@/utils/date";

interface NoteCardProps {
  note: Note;
  onClick: () => void;
}

const NoteCard = ({ note, onClick }: NoteCardProps) => {
  // Get the first few characters of content for preview
  const contentPreview = note.content.substring(0, 100);

  return (
    <div
      onClick={onClick}
      className="p-4 bg-white border border-gray-100 rounded-lg mb-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
    >
      <h3 className="text-xl font-bold mb-1">{note.title}</h3>
      <p className="text-gray-600 mb-2 line-clamp-2">{contentPreview}</p>
      <p className="text-gray-400 text-sm">{formatDate(note.createdAt)}</p>
    </div>
  );
};

export default NoteCard;
