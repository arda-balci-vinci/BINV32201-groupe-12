import type { Application, ApplicationDbo, ApplicationDto } from "../models/application.ts";

export const toApplication = (dbo: ApplicationDbo): Application => ({
  id: dbo.id,
  offerId: dbo.offer_id,
  studentId: dbo.student_id,
  message: dbo.message,
  status: dbo.status,
  appliedAt: dbo.applied_at,
});

export const toApplicationDto = (application: Application): ApplicationDto => application;
