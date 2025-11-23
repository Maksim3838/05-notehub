export interface Note {
  id: string;
  title: string;
  content: string; 
  tag: "work" | "personal" | "ideas" | "other"; 
  createdAt: string;
  updatedAt: string;
}
