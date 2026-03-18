export interface KanbanTaskType {
  id : string;
  title : string;
}

export type status = 'completed' | 'active' | 'pending';

export interface Todo {
    id : string,
    name : string;
    status : status;
    order : number;
}

export interface Task {
  id : string,
  name : string; 
  allocatedTime : number; 
  spentTime : number;
  status : status;
  priority : number;
  todos : Todo[];
}

export interface Goal {
  id : string;
  name : string;
  description : string;
  tasks : Task[];
  status : status;
  allocatedTime : number;
  remainingTime : number;
  timeRemainingForTasks : number;
}