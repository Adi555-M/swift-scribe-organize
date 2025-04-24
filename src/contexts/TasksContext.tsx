
import React, { createContext, useContext, useState, useEffect } from "react";
import { Task } from "@/types";

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "createdAt" | "completedAt" | "completed">) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  getActiveTasks: () => Task[];
  getCompletedTasks: () => Task[];
}

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export const TasksProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Load tasks from localStorage on component mount
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  useEffect(() => {
    // Save tasks to localStorage whenever they change
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Auto-delete tasks completed more than 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    setTasks((prevTasks) =>
      prevTasks.filter((task) => {
        if (!task.completed || !task.completedAt) return true;
        
        const completedDate = new Date(task.completedAt);
        return completedDate > thirtyDaysAgo;
      })
    );
  }, [tasks]);

  const addTask = (task: Omit<Task, "id" | "createdAt" | "completedAt" | "completed">) => {
    const newTask: Task = {
      id: Date.now().toString(),
      ...task,
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const toggleTask = (id: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? new Date().toISOString() : null,
            }
          : task
      )
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const getActiveTasks = () => {
    return tasks.filter((task) => !task.completed);
  };

  const getCompletedTasks = () => {
    return tasks.filter((task) => task.completed);
  };

  return (
    <TasksContext.Provider
      value={{ tasks, addTask, toggleTask, deleteTask, getActiveTasks, getCompletedTasks }}
    >
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (context === undefined) {
    throw new Error("useTasks must be used within a TasksProvider");
  }
  return context;
};
