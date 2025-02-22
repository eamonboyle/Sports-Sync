import {  Conversation, Message, Team, User } from "@prisma/client";

export type FullMessageType = Message & {
  sender: User, 
  seen: User[]
};

export type FullConversationType = Conversation & { 
  users: User[]; 
  messages: FullMessageType[]
};

export type FullTeamEventType = Team & {
  events: Event[]
}

export type exercise = {
  title?: string;
  reps?: number | null;
  sets?: number | null;
  exercise?: string;
  weight?: number | null;
  id?: string;
  isPersonalRecord?: boolean
};