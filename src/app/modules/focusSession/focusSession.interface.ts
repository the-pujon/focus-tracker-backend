import { SessionStatus } from "@prisma/client"; // Assuming you're using Prisma's generated enums

export interface IFocusSession {
  id: string;  
  userId: string;  
  startTime?: Date;  
  endTime?: Date;  
  sessionTime: number;
  breakTime: number;  
  status?: SessionStatus;
  pausedTime?: number;
  createdAt: Date;  
  updatedAt: Date;  
}
