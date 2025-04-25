
import { Link, useLocation } from "react-router-dom";
import { FileText, ListTodo } from "lucide-react";

const BottomNavBar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
      <div className="max-w-lg mx-auto flex justify-around">
        <Link
          to="/"
          className={`flex flex-col items-center py-3 px-5 rounded-xl transition-colors ${
            path === "/" ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <FileText size={24} />
          <span className="text-xs mt-1 font-medium">Notes</span>
        </Link>
        
        <Link
          to="/tasks"
          className={`flex flex-col items-center py-3 px-5 rounded-xl transition-colors ${
            path === "/tasks" ? "text-blue-500" : "text-gray-400"
          }`}
        >
          <ListTodo size={24} />
          <span className="text-xs mt-1 font-medium">Tasks</span>
        </Link>
      </div>
    </div>
  );
};

export default BottomNavBar;
