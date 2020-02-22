using System;

namespace Domain
{
    //This is a join entity which combines Users and Activities
    //This consist are our Navigation properties (AppUser and Activity) which provides a way to navigate an association between two entities - https://docs.microsoft.com/en-us/ef/ef6/fundamentals/relationships
    //.NET is "convention based", where it'll identify AppUserId is the ID for AppUser and ActivityId is the ID for Activity
    //We use the keyword "virtual" in order to do Lazy loading in related properties, otherwise this keyword can be removed
    public class UserActivity
    {
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }

        public Guid ActivityId { get; set; }
        public virtual Activity Activity { get; set; }
        public DateTime DateJoined { get; set;} //date that the user joined the activity
        public bool IsHost { get; set; } // determine whether the user is the host of the activity
    }
}