import { SessionStatus } from "@prisma/client"; // Assuming you're using Prisma's generated enums

export interface IFocusSession {
  id: string;  
  userId: string;  
  startTime?: Date;  
  endTime: Date;  
  breakTime: number;  
  status: SessionStatus;  
  createdAt: Date;  
  updatedAt: Date;  
}
