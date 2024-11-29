namespace Application.Recruiters.PatchDescription;

using FluentValidation;

internal sealed class Validator : AbstractValidator<PatchDescriptionCommand>
{
    public Validator()
    {
        _ = RuleFor(static c => c.Description)
            .NotEmpty()
            .WithMessage("The Description should not be empty")
            .NotNull()
            .WithMessage("The Description is required")
            .MaximumLength(400)
            .WithMessage("The Description should not exceed 400 characters");
    }
}