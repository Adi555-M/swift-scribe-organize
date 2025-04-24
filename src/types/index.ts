
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  content: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
}
