using System;
using System.Collections.Generic;
using System.Linq;
using Domain;

namespace Persistence
{
    public class Seed
    {
        //defining as a static class
        public static void SeedData(DataContext context)
        {
            //check if the DataContext is performing any activity
            if(!context.Activities.Any()){
                var activities = new List<Activity>
                {
                    new Activity
                    {
                        Title = "Past activity 1",
                        Date = DateTime.Now.AddMonths(-2),
                        Description = "Activity 2 months ago",
                        Category = "Drinks",
                        City = "Colombo",
                    },
                    new Activity
                    {
                        Title = "Past activity 2",
                        Date = DateTime.Now.AddMonths(-3),
                        Description = "Activity 3 months ago",
                        Category = "Dinner",
                        City = "Kandy",
                    },
                    new Activity
                    {
                        Title = "Past activity 3",
                        Date = DateTime.Now.AddMonths(-4),
                        Description = "Activity 4 months ago",
                        Category = "Lunch",
                        City = "Galle",
                    },
                    new Activity
                    {
                        Title = "Upcoming activity 1",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Activity in 2 months time",
                        Category = "Evening catch up",
                        City = "Jaffna",
                    }
                };

                //"AddRange" will be used to add data using IEnumerables such as the "activities" List in here
                context.Activities.AddRange(activities);
                context.SaveChanges();
            }
        }
    }
}