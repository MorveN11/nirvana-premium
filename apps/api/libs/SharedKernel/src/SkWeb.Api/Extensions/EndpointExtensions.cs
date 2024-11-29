namespace SkWeb.Api.Extensions;

using System.Reflection;
using Endpoints;
using Microsoft.Extensions.DependencyInjection.Extensions;

public static class EndpointExtensions
{
    private const int DefaultCacheDuration = 5;

    public static IServiceCollection AddEndpoints(
        this IServiceCollection services,
        Assembly assembly
    )
    {
        ServiceDescriptor[] serviceDescriptors = assembly
            .DefinedTypes.Where(static type =>
                type is { IsAbstract: false, IsInterface: false }
                && type.IsAssignableTo(typeof(IEndpoint))
            )
            .Select(static type => ServiceDescriptor.Transient(typeof(IEndpoint), type))
            .ToArray();

        services.TryAddEnumerable(serviceDescriptors);

        return services;
    }

    public static IApplicationBuilder MapEndpoints(
        this WebApplication app,
        RouteGroupBuilder? routeGroupBuilder = null
    )
    {
        IEnumerable<IEndpoint> endpoints = app.Services.GetRequiredService<
            IEnumerable<IEndpoint>
        >();

        IEndpointRouteBuilder builder = routeGroupBuilder is null ? app : routeGroupBuilder;

        foreach (IEndpoint endpoint in endpoints)
        {
            endpoint.MapEndpoint(builder);
        }

        return app;
    }

    public static IEndpointConventionBuilder AddCache(
        this IEndpointConventionBuilder builder,
        string tagName,
        int duration = DefaultCacheDuration
    )
    {
        builder.CacheOutput(b => b.Expire(TimeSpan.FromMinutes(duration)).Tag(tagName));

        return builder;
    }

    public static IEndpointConventionBuilder AddCacheWithAuthorization(
        this IEndpointConventionBuilder builder,
        string tagName,
        int duration = DefaultCacheDuration
    )
    {
        builder.CacheOutput(
            b =>
                b.Expire(TimeSpan.FromMinutes(duration))
                    .Tag(tagName)
                    .VaryByValue(context =>
                    {
                        string? token = context.Request.Headers["Authorization"].FirstOrDefault();

                        return new KeyValuePair<string, string>(
                            "Authorization",
                            token ?? string.Empty
                        );
                    }),
            true
        );

        return builder;
    }
}
