
import { Link, useLocation } from "react-router-dom";
import { FileText, ListTodo } from "lucide-react";

const BottomNavBar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 px-4 z-10">
      <Link
        to="/"
        className={`flex flex-col items-center p-2 rounded-xl transition-colors w-1/2 ${
          path === "/" ? "text-blue-500" : "text-gray-400"
        }`}
      >
        <FileText size={24} />
        <span className="text-sm mt-1 font-medium">Notes</span>
      </Link>
      
      <Link
        to="/tasks"
        className={`flex flex-col items-center p-2 rounded-xl transition-colors w-1/2 ${
          path === "/tasks" ? "text-blue-500" : "text-gray-400"
        }`}
      >
        <ListTodo size={24} />
        <span className="text-sm mt-1 font-medium">Tasks</span>
      </Link>
    </div>
  );
};

export default BottomNavBar;
