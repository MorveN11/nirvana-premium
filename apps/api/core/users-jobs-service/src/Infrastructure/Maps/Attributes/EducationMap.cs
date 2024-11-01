namespace Infrastructure.Maps.Attributes;

using Domain.Attributes.Educations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SkInfrastructure.Maps;

internal sealed class EducationMap : BaseEntityMap<Education>
{
    public override void ConfigureEntity(EntityTypeBuilder<Education> builder)
    {
        _ = builder.Property(static e => e.Degree).HasMaxLength(150).IsRequired();

        _ = builder.Property(static e => e.Institution).HasMaxLength(100).IsRequired();

        _ = builder.Property(static e => e.StartDate).IsRequired();

        _ = builder.Property(static e => e.EndDate).HasDefaultValue(null).ValueGeneratedOnAdd();

        _ = builder
            .Property(static e => e.Description)
            .HasMaxLength(500)
            .HasDefaultValue(null)
            .ValueGeneratedOnAdd();

        _ = builder
            .HasOne(static e => e.Developer)
            .WithMany(static d => d.Educations)
            .HasForeignKey(static e => e.DeveloperId)
            .IsRequired();
    }
}