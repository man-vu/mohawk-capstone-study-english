import prisma from '../prismaClient';
import { Prisma } from '@prisma/client';
export interface AuditTrail {
  AuditId: number;
  TableName: string;
  RecordId: number;
  Action: string;
  UserId: number;
  ChangeTimestamp: Date;
  OldValues: string;
  NewValues: string;
  Context: string;
}

export class AuditTrailModel {
  static create(data: Prisma.AuditTrailCreateInput) {
    return prisma.auditTrail.create({ data });
  }

  static findById(AuditId: number) {
    return prisma.auditTrail.findUnique({ where: { AuditId } });
  }

  static update(AuditId: number, data: Prisma.AuditTrailUpdateInput) {
    return prisma.auditTrail.update({ where: { AuditId }, data });
  }

  static delete(AuditId: number) {
    return prisma.auditTrail.delete({ where: { AuditId } });
  }

  static findAll() {
    return prisma.auditTrail.findMany();
  }
}
export default AuditTrailModel;
