import prisma from '../prismaClient';
import type { Prisma } from '@prisma/client';

export interface MockTest {
  MockTestId: number;
  Title: string;
  Description?: string | null;
  TotalDuration: number;
  CreatedBy?: number | null;
  CreatedAt: Date;
}

export class MockTestModel {
  static create(data: Prisma.MockTestCreateInput) {
    return prisma.mockTest.create({ data });
  }

  static findById(MockTestId: number) {
    return prisma.mockTest.findUnique({ where: { MockTestId }, include: { MockTestSection: true } });
  }

  static findAll() {
    return prisma.mockTest.findMany({ include: { MockTestSection: true } });
  }
}
export default MockTestModel;
