export interface ITask {
    id?: string;
    text: string;
    completed?: boolean;
    priority: 'low' | 'medium' | 'high';
    dueDate: Date;
  }
  