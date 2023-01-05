import { Personalization, ProfileStatus } from "@prisma/client";

export type { Profile };

interface Profile {
  id: number;
  personalization: Personalization;
  personalizationId: number;
  status: ProfileStatus;
  lastStatusUpdate: Date;
}
