namespace Domain.Entities.Jobs;

using SkDomain.Errors;

public static class JobErrors
{
    public static readonly Error NotJobsFound = Error.NotFound(
        "Jobs.NotJobsFound",
        "No jobs were found"
    );

    public static Error JobNotFound(Guid jobId)
    {
        return Error.NotFound("Jobs.JobNotFound", $"Job with id {jobId} was not found");
    }

    public static readonly Error JobNotCreated = Error.Failure(
        "Jobs.JobNotCreated",
        "Job was not created"
    );
}
