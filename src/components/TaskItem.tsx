
import { Task } from "@/types";
import { formatDateTime } from "@/utils/date";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

const TaskItem = ({ task, onToggle }: TaskItemProps) => {
  return (
    <div className="p-4 bg-white border border-gray-100 rounded-lg mb-3 shadow-sm animate-fade-in">
      <div className="flex items-start">
        <Checkbox
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={onToggle}
          className="mt-1 mr-3 h-5 w-5 border-gray-300 data-[state=checked]:bg-primary"
        />
        <div className="flex-1">
          <p className={`text-base ${task.completed ? "line-through text-gray-400" : "text-black"}`}>
            {task.content}
          </p>
          <div className="mt-1 text-xs text-gray-400">
            <p>Created: {formatDateTime(task.createdAt)}</p>
            {task.completed && task.completedAt && (
              <p>Completed: {formatDateTime(task.completedAt)}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
