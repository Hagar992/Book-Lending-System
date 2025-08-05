using BackEnd.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace BackEnd.Data;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
{
    public ApplicationDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();
        optionsBuilder.UseSqlServer("Server=DESKTOP-4CJ0VM2;Database=BookLendingSystemDB;Trusted_Connection=True;TrustServerCertificate=True;Connection Timeout=30;");
        return new ApplicationDbContext(optionsBuilder.Options);
    }
}