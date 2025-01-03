namespace Domain.Entities.Users;

using Developers;
using Enums;
using Joins.UserFollows;
using Joins.UserReviews;
using Recruiters;
using SkDomain.Entities;

public sealed class User : BaseEntity
{
    public required string Email { get; init; }
    public required string IdentityId { get; init; }
    public required UserRole Role { get; init; }
    public bool DoOnboarding { get; init; }

    public Recruiter? Recruiter { get; init; }
    public Developer? Developer { get; init; }

    public IList<User> Follows { get; } = [];
    public IList<User> Followers { get; } = [];

    public IList<UserFollow> UserFollows { get; } = [];
    public IList<UserFollow> UserFollowers { get; } = [];

    public IList<User> Reviews { get; } = [];
    public IList<User> ReviewsFrom { get; } = [];

    public IList<UserReview> UserReviews { get; } = [];
    public IList<UserReview> UserReviewsFrom { get; } = [];
}
