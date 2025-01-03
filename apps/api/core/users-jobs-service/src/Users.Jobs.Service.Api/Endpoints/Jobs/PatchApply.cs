namespace Users.Jobs.Service.Api.Endpoints.Jobs;

using Application;
using Application.Jobs.PatchApply;
using MediatR;
using SkDomain.Results;
using SkWeb.Api.Endpoints;
using SkWeb.Api.Infrastructure;

internal sealed class PatchApply : IEndpoint
{
    public sealed class Request
    {
        public required Guid DeveloperId { get; init; }
        public required string Status { get; init; }
    }

    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        _ = app.MapPatch(
                "api/users-jobs/jobs/status/{jobId:guid}",
                static async (
                    Guid jobId,
                    Request request,
                    ISender sender,
                    CancellationToken cancellationToken
                ) =>
                {
                    PatchCommand command =
                        new()
                        {
                            JobId = jobId,
                            DeveloperId = request.DeveloperId,
                            Status = request.Status,
                        };

                    Result result = await sender.Send(command, cancellationToken);

                    return result.Match(Results.NoContent, CustomResults.Problem);
                }
            )
            .WithTags(Tags.Jobs)
            .RequireAuthorization();
    }
}
