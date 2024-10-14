namespace Application.Core.Users.GetById;

public sealed record UserResponse(Guid Id, string Email, string FirstName, string LastName);
