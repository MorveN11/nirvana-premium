namespace Users.Jobs.Service.Api.Endpoints.Recruiters;

using Application.Recruiters.GetAll;
using MediatR;
using SkApplication.Responses;
using SkDomain.Results;
using SkWeb.Api.Endpoints;
using SkWeb.Api.Infrastructure;

internal sealed class GetAll : IEndpoint
{
    public void MapEndpoint(IEndpointRouteBuilder app)
    {
        _ = app.MapGet(
                "api/users-jobs/recruiters",
                static async (
                    ISender sender,
                    CancellationToken cancellationToken,
                    int page = 1,
                    int pageSize = 10
                ) =>
                {
                    GetAllQuery query = new(page, pageSize);

                    Result<PagedList<Response>> result = await sender.Send(
                        query,
                        cancellationToken
                    );

                    return result.Match(Results.Ok, CustomResults.Problem);
                }
            )
            .WithTags(Tags.Recruiters);
    }
}