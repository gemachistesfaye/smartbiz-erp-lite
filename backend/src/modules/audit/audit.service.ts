import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditAction, Prisma } from '@prisma/client';

export interface AuditLogEntry {
  businessId: string;
  userId: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogService implements OnModuleInit {
  private static instance: AuditLogService;

  constructor(private readonly prisma: PrismaService) {
    AuditLogService.instance = this;
  }

  onModuleInit() {
    AuditLogService.instance = this;
  }

  static getInstance(): AuditLogService | null {
    return AuditLogService.instance;
  }

  async log(entry: AuditLogEntry): Promise<void> {
    try {
      await this.prisma.auditLog.create({
        data: {
          businessId: entry.businessId,
          userId: entry.userId,
          action: entry.action,
          entity: entry.entity,
          entityId: entry.entityId,
          oldValues: entry.oldValues ? (entry.oldValues as Prisma.InputJsonValue) : Prisma.JsonNull,
          newValues: entry.newValues ? (entry.newValues as Prisma.InputJsonValue) : Prisma.JsonNull,
          ipAddress: entry.ipAddress || undefined,
          userAgent: entry.userAgent || undefined,
        },
      });
    } catch {
      // Silently fail - audit logging should never break the main flow
    }
  }

  async logCreate(
    businessId: string,
    userId: string,
    entity: string,
    entityId: string,
    newValues: Record<string, unknown>,
    request?: { ip?: string; userAgent?: string },
  ): Promise<void> {
    await this.log({
      businessId,
      userId,
      action: 'CREATE',
      entity,
      entityId,
      newValues,
      ipAddress: request?.ip,
      userAgent: request?.userAgent,
    });
  }

  async logUpdate(
    businessId: string,
    userId: string,
    entity: string,
    entityId: string,
    oldValues: Record<string, unknown>,
    newValues: Record<string, unknown>,
    request?: { ip?: string; userAgent?: string },
  ): Promise<void> {
    await this.log({
      businessId,
      userId,
      action: 'UPDATE',
      entity,
      entityId,
      oldValues,
      newValues,
      ipAddress: request?.ip,
      userAgent: request?.userAgent,
    });
  }

  async logDelete(
    businessId: string,
    userId: string,
    entity: string,
    entityId: string,
    oldValues: Record<string, unknown>,
    request?: { ip?: string; userAgent?: string },
  ): Promise<void> {
    await this.log({
      businessId,
      userId,
      action: 'DELETE',
      entity,
      entityId,
      oldValues,
      ipAddress: request?.ip,
      userAgent: request?.userAgent,
    });
  }

  async logLogin(
    businessId: string,
    userId: string,
    request?: { ip?: string; userAgent?: string },
  ): Promise<void> {
    await this.log({
      businessId,
      userId,
      action: 'LOGIN',
      entity: 'User',
      entityId: userId,
      ipAddress: request?.ip,
      userAgent: request?.userAgent,
    });
  }
}
