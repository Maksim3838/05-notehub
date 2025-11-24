export type AllowedTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: AllowedTag;
  createdAt: string;
  updatedAt: string;
}
