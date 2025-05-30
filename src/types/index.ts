
import { ReactNode } from "react";

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  titleNode?: ReactNode;
  contentNode?: ReactNode;
}

export interface Task {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
}
