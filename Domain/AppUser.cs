using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

namespace Domain
{
    public class AppUser : IdentityUser
    {
        public string DisplayName { get; set;}

        //the following collection will define the relationship between AppUser and UserActivity
        //public ICollection<UserActivity> UserActivities { get; set; }// without "virtual" for Eager loading
        public virtual ICollection<UserActivity> UserActivities { get; set; }// using "virtual" for Lazy loading
    }
}