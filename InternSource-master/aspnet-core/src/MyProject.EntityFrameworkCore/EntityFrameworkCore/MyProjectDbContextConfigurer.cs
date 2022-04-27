 // This file is not generated, but this comment is necessary to exclude it from StyleCop analysis 
 // <auto-generated/> 
 using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace MyProject.EntityFrameworkCore
{
    public static class MyProjectDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<MyProjectDbContext> builder, string connectionString)
        {
            builder.UseSqlServer(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<MyProjectDbContext> builder, DbConnection connection)
        {
            builder.UseSqlServer(connection);
        }
    }
}
