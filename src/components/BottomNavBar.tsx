
import { Link, useLocation } from "react-router-dom";
import { FileText, List } from "lucide-react";

const BottomNavBar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 px-4 z-10">
      <Link
        to="/"
        className={`flex flex-col items-center p-2 rounded-lg transition-colors w-1/2 ${
          path === "/" ? "text-blue-500 bg-blue-50" : "text-gray-500"
        }`}
      >
        <FileText size={24} />
        <span className="text-sm mt-1">Notes</span>
      </Link>
      
      <Link
        to="/tasks"
        className={`flex flex-col items-center p-2 rounded-lg transition-colors w-1/2 ${
          path === "/tasks" ? "text-blue-500 bg-blue-50" : "text-gray-500"
        }`}
      >
        <List size={24} />
        <span className="text-sm mt-1">Tasks</span>
      </Link>
    </div>
  );
};

export default BottomNavBar;
