
import { useState } from "react";
import { useTasks } from "@/contexts/TasksContext";
import TaskItem from "@/components/TaskItem";
import TabSwitcher from "@/components/TabSwitcher";
import FloatingActionButton from "@/components/FloatingActionButton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const TasksPage = () => {
  const { addTask, toggleTask, getActiveTasks, getCompletedTasks } = useTasks();
  const [activeTab, setActiveTab] = useState("active");
  const [newTaskContent, setNewTaskContent] = useState("");
  const [isAddingTask, setIsAddingTask] = useState(false);
  const { toast } = useToast();

  const activeTasks = getActiveTasks();
  const completedTasks = getCompletedTasks();

  const handleAddTask = () => {
    if (newTaskContent.trim()) {
      addTask({
        content: newTaskContent,
      });
      setNewTaskContent("");
      setIsAddingTask(false);
      
      toast({
        title: "Task added successfully",
        duration: 2000,
      });
    }
  };

  const tabs = [
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="pb-20 px-4 pt-4">
      <h1 className="text-3xl font-bold mb-4">My Tasks</h1>

      <TabSwitcher
        activeTab={activeTab}
        onTabChange={setActiveTab}
        tabs={tabs}
      />

      {isAddingTask && (
        <div className="mb-4 flex gap-2 animate-slide-in-bottom">
          <Input
            autoFocus
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            placeholder="Add a new task..."
            className="border-gray-200"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAddTask();
              }
            }}
          />
          <Button onClick={handleAddTask}>Add</Button>
        </div>
      )}

      {activeTab === "active" && (
        <div>
          {!isAddingTask && (
            <div 
              className="mb-4 p-4 border border-gray-200 bg-gray-50 rounded-lg text-gray-500 text-center cursor-pointer hover:bg-gray-100"
              onClick={() => setIsAddingTask(true)}
            >
              Add a new task...
            </div>
          )}
          
          {activeTasks.length === 0 && !isAddingTask ? (
            <div className="text-center py-8 text-gray-500">
              No active tasks. Add one above!
            </div>
          ) : (
            <div className="space-y-2">
              {activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "completed" && (
        <div>
          {completedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No completed tasks yet.
            </div>
          ) : (
            <div className="space-y-2">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => toggleTask(task.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      <FloatingActionButton onClick={() => setIsAddingTask(true)} />
    </div>
  );
};

export default TasksPage;
