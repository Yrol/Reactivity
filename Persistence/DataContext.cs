using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    //public class DataContext : DbContext

    //We're using IdentityDbContext instead of DbContext since we need to use this class with .NET Core Identity 
    //Passing the AppUser Class defined in Domain project
    //Refer to the Seed.cs class to find the DB relationships including Activities, Users and User Activities (attendees and hosts)
    //The Seed.cs will run  when the program executes to seed sample data to the app
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        // A DbSet represents the collection of all entities in the context, or that can be queried from the database, of a given type
        // DbSet<TEntity> Table Name {get; Set;}
        //Passing the "Value" object/entity defined in the Domain layer
        //In this case "Values" is the table name
        public DbSet<Value> Values { get; set; }
        public DbSet<Activity> Activities { get; set; }

        //in this case UserActivities is our table name
        public DbSet<UserActivity> UserActivities { get; set; }

        //seeding data into the DB
        //overriding "OnModelCreating" method of the DbContext
        protected override void OnModelCreating(ModelBuilder builder)
        {
            //we use OnModelCreating since we're using IdentityDbContext and AppUser (class defined in Domain project)
            //OnModelCreating gives you access to a ModelBuilder instance that you can use to configure/customize the model.
            base.OnModelCreating(builder);

            builder.Entity<Value>()
                .HasData(
                    new Value { Id = 1, Name = "Value 101" },
                    new Value { Id = 2, Name = "Value 102" },
                    new Value { Id = 3, Name = "Value 102" }
                );

            //building the primary key between AppUser and Activities
            builder.Entity<UserActivity>(x => x.HasKey(ua => new { ua.AppUserId, ua.ActivityId }));

            //[first half] Relationship - AppUser with many UserActivities i.e. as attendee or host (defined using ICollection inside AppUser) and shares one foreign key which is the AppUserId
            builder.Entity<UserActivity>()
                .HasOne(u => u.AppUser)
                .WithMany(a => a.UserActivities)
                .HasForeignKey(u => u.AppUserId);

            //[second half] of the Relationship - an Activity can have many UserActivities i.e. many attendees (defined using ICollection inside Activity) and shares one foreign key which is the ActvityId
            builder.Entity<UserActivity>()
                .HasOne(a => a.Activity)
                .WithMany(u => u.UserActivities)
                .HasForeignKey(a => a.ActivityId);

            //one activity can have many appUsers and also an appUser can have many activities
        }
    }
}