using Domain;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {    
        }

        // A DbSet represents the collection of all entities in the context, or that can be queried from the database, of a given type
        // DbSet<TEntity> Table Name {get; Set;}
        //Passing the "Value" object/entity defined in the Domain layer
        //In this case "Values" is the table name
        public DbSet<Value> Values {get; set;}
        public DbSet<Activity> Activities {get; set;}

        //seeding data into the DB
        //overriding "OnModelCreating" method of the DbContext
        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.Entity<Value>()
                .HasData(
                    new Value {Id = 1, Name = "Value 101"},
                    new Value {Id = 2, Name = "Value 102" },
                    new Value {Id = 3, Name = "Value 102"}
                );

        }
    }
}