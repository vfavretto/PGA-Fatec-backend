import { Module } from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { AuditController } from './audit.controller';
import { ConfigurationSnapshotService } from './services/configuration-snapshot.service';
import { VersionManagerService } from './services/version-manager.service';
import { AuditLogService } from './services/audit-log.service';
import { AuditRepository } from './repositories/audit.repository';
import { VersionRepository } from './repositories/version.repository';

@Module({
  controllers: [AuditController],
  providers: [
    PrismaService,
    ConfigurationSnapshotService,
    VersionManagerService,
    AuditLogService,
    AuditRepository,
    VersionRepository,
  ],
  exports: [
    ConfigurationSnapshotService,
    VersionManagerService,
    AuditLogService,
    AuditRepository,
    VersionRepository,
  ],
})
export class AuditModule {}
