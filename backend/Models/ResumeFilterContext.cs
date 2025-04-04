using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace ResumeFilterBackend.Models;

public partial class ResumeFilterContext : DbContext
{
    public ResumeFilterContext()
    {
    }

    public ResumeFilterContext(DbContextOptions<ResumeFilterContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Resume> Resumes { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=IN-DTDLV64;Database=ResumeFilter;User id=sa;Password=sa;Encrypt=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Resume>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Resumes__3214EC0702B9B542");

            entity.Property(e => e.FileName).HasMaxLength(255);
            entity.Property(e => e.UploadDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC276082E52D");

            entity.Property(e => e.Id).HasColumnName("ID");
            entity.Property(e => e.EmailId)
                .HasMaxLength(255)
                .HasColumnName("EmailID");
            entity.Property(e => e.FirstName).HasMaxLength(100);
            entity.Property(e => e.LastName).HasMaxLength(100);
            entity.Property(e => e.Password).HasMaxLength(255);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
