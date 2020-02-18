using System;
using System.Collections.Generic;

namespace Domain
{
    public class Activity
    {
        //Using the type Guid for the Id (instead of int or etc)
        public Guid Id { get; set;}
        public string Title {get; set;}
        public string Description {get; set;}
        public string Category {get; set;}
        public DateTime Date {get; set;}
        public string City {get; set;}

        
        //the following collection will define the relationship between Activity and UserActivity
        public ICollection<UserActivity> UserActivities { get; set; }
    }
}