using System;

namespace Domain
{
    //This is a join entity which combines Users and Activities
    //.NET is "convention based", where it'll identify AppUserId is the ID for AppUser and ActivityId is the ID for Activity 
    public class UserActivity
    {
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }

        public Guid ActivityId { get; set; }
        public Activity Activity { get; set; }
        public DateTime DateJoined { get; set;} //date that the user joined the activity
        public bool IsHost { get; set; } // determine whether the user is the host of the activity
    }
}