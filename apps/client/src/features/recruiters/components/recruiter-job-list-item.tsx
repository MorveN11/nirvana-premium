// components/JobListItem.tsx
import Badge from '@/components/badge';
import { Card } from '@/components/ui/card';
import { Job } from '@/features/jobs/lib/constants';
import { cn, formatMoney, relativeDate } from '@/lib/utils';
import { Banknote, Building2, Clock, MapPin } from 'lucide-react';

interface JobListItemProps {
  job: Job;
  className?: string;
}

export default function RecruiterJobListItem({ job, className }: JobListItemProps) {
  return (
    <Card className={cn('group transition-all hover:shadow-md', className)}>
      <div className={cn('flex flex-col sm:flex-row w-full gap-4 sm:gap-5 p-4 sm:p-6')}>
        <div className={cn('flex-grow space-y-2 sm:space-y-3')}>
          {/* Header Section */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <h2 className={cn('text-lg sm:text-xl font-bold text-foreground')}>{job.title}</h2>
              <Badge
                variant={job.status === 'Open' ? 'success' : 'secondary'}
                className="flex-shrink-0 mt-1"
              >
                {job.status}
              </Badge>
            </div>

            {/* Job Details */}
            <div className={cn('flex flex-wrap gap-2 sm:gap-3 text-sm text-muted-foreground')}>
              <div className="flex items-center gap-1">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span>{job.schedule}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{job.location}</span>
              </div>
              <Badge variant="secondary" className="flex-shrink-0">
                {job.modality}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <p className={cn('line-clamp-2 text-sm sm:text-base text-muted-foreground')}>
            {job.description}
          </p>

          {/* Footer Section */}
          <div
            className={cn(
              'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2',
              'text-sm text-muted-foreground',
            )}
          >
            <div className={cn('flex items-center gap-2')}>
              <Banknote className="h-4 w-4 flex-shrink-0" />
              <span>{formatMoney(job.salaryPerHour)} / hour</span>
            </div>

            <div className={cn('flex items-center gap-2')}>
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span>Posted {relativeDate(new Date(job.createdAt))}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
