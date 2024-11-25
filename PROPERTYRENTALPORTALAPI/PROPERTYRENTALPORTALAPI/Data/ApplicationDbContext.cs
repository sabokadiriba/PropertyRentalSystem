
using System.Collections.Generic;
using System.Reflection.Emit;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using PROPERTYRENTALPORTALAPI.Models.Domain;


namespace PROPERTYRENTALPORTALAPI.Data
{
   
    public class ApplicationDbContext : IdentityDbContext
    {
        public DbSet<ApplicationUser> ApplicationUser { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<RentRequest> RentRequests { get; set; }
       
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<RentRequest>()
             .HasOne(r => r.Seeker)
             .WithMany()
             .HasForeignKey(r => r.SeekerId)
             .OnDelete(DeleteBehavior.Restrict);
        }
    }

}
