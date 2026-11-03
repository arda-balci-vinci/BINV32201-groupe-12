import type { Db } from "../db/database.ts";
import type { ApplicationDbo } from "../models/application.ts";
import type { OfferStatus } from "../models/offer.ts";

interface ApplicationKeyParams {
  offerId: number;
  studentId: number;
}

interface InsertParams {
  offerId: number;
  studentId: number;
  message: string | null;
}

interface ApplicationIdParams {
  id: number;
}

export const createApplicationsRepository = (db: Db) => {
  const findOfferStatus = db.prepare<{ id: number }, { status: OfferStatus }>(
    "SELECT status FROM offers WHERE id = @id",
  );
  const findActive = db.prepare<ApplicationKeyParams, ApplicationDbo>(`
    SELECT id, offer_id, student_id, message, status, applied_at
    FROM applications
    WHERE offer_id = @offerId
      AND student_id = @studentId
      AND status IN ('IN_PROGRESS', 'SELECTED')
    ORDER BY id DESC
    LIMIT 1
  `);
  const insert = db.prepare<InsertParams, { id: number }>(`
    INSERT INTO applications (offer_id, student_id, message)
    VALUES (@offerId, @studentId, @message)
    RETURNING id
  `);
  const findById = db.prepare<ApplicationIdParams, ApplicationDbo>(`
    SELECT id, offer_id, student_id, message, status, applied_at
    FROM applications
    WHERE id = @id
  `);
  const findByStudent = db.prepare<{ studentId: number }, ApplicationDbo>(`
    SELECT a.id, a.offer_id, a.student_id, a.message, a.status, a.applied_at,
           o.title AS offer_title, c.short_name AS company_short_name
    FROM applications a
    JOIN offers o ON o.id = a.offer_id
    JOIN companies c ON c.id = o.company_id
    WHERE a.student_id = @studentId
    ORDER BY a.applied_at DESC, a.id DESC
  `);

  return {
    findOfferStatus: (id: number): OfferStatus | null => findOfferStatus.get({ id })?.status ?? null,
    findActive: (offerId: number, studentId: number): ApplicationDbo | null =>
      findActive.get({ offerId, studentId }) ?? null,
    insert: (offerId: number, studentId: number, message: string | null): ApplicationDbo => {
      const inserted = insert.get({ offerId, studentId, message });
      if (inserted === undefined) {
        throw new Error("La candidature n'a pas pu être créée");
      }
      const application = findById.get({ id: inserted.id });
      if (application === undefined) {
        throw new Error("La candidature créée est introuvable");
      }
      return application;
    },
    findByStudent: (studentId: number): ApplicationDbo[] => findByStudent.all({ studentId }),
  };
};

export type ApplicationsRepository = ReturnType<typeof createApplicationsRepository>;
