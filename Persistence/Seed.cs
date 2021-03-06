using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace Persistence
{
    public class Seed
    {
        //defining as a static class
        //passing the context to save DB activities
        //passing the UserManager create users using .Net core Identity
        //This class will execute within program.cs to seed the following test data structure to the app
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {

            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        Id = "a",
                        DisplayName = "Bob", // this field is defined in our implementation - AppUser
                        UserName = "bob", //  this field is coming from .Net Core IdentityUser
                        Email = "bob@test.com" //this field is coming from .Net Core IdentityUser
                    },

                    new AppUser
                    {
                        Id = "b",
                        DisplayName = "Tom", // this field is defined in our implementation - AppUser
                        UserName = "tom", //  this field is coming from .Net Core IdentityUser
                        Email = "tom@test.com" //this field is coming from .Net Core IdentityUser
                    },

                    new AppUser
                    {
                        Id = "c",
                        DisplayName = "jane", // this field is defined in our implementation - AppUser
                        UserName = "jane", //  this field is coming from .Net Core IdentityUser
                        Email = "jane@test.com" //this field is coming from .Net Core IdentityUser
                    }
                };

                //creating and saving users using userManager of .Net Core Identity 
                foreach (var user in users)
                {
                    await userManager.CreateAsync(user,"Pa$$w0rd");
                }
            }

            //check if the DataContext is performing any activity
            if (!context.Activities.Any())
            {
                var activities = new List<Activity>
                {
                    new Activity
                    {
                        Title = "Past activity 1",
                        Date = DateTime.Now.AddMonths(-2),
                        Description = "Activity 2 months ago",
                        Category = "Drinks",
                        City = "Colombo",
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-2)
                            }
                        }
                    },
                    new Activity
                    {
                        Title = "Past activity 2",
                        Date = DateTime.Now.AddMonths(-3),
                        Description = "Activity 3 months ago",
                        Category = "Dinner",
                        City = "Kandy",

                        //attendees of the activity
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(-1)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(-1)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Past activity 3",
                        Date = DateTime.Now.AddMonths(-4),
                        Description = "Activity 4 months ago",
                        Category = "Lunch",
                        City = "Galle",

                        //attendees of the activity
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "b",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(1)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(1)
                            },
                        }
                    },
                    new Activity
                    {
                        Title = "Upcoming activity 1",
                        Date = DateTime.Now.AddMonths(2),
                        Description = "Activity in 2 months time",
                        Category = "Evening catch up",
                        City = "Jaffna",

                        //attendees of the activity
                        UserActivities = new List<UserActivity>
                        {
                            new UserActivity
                            {
                                AppUserId = "c",
                                IsHost = true,
                                DateJoined = DateTime.Now.AddMonths(2)
                            },
                            new UserActivity
                            {
                                AppUserId = "a",
                                IsHost = false,
                                DateJoined = DateTime.Now.AddMonths(2)
                            },
                        }
                    }
                };

                //"AddRange" will be used to add data using IEnumerables such as the "activities" List in here
                context.Activities.AddRange(activities);
                context.SaveChanges();
            }
        }
    }
}