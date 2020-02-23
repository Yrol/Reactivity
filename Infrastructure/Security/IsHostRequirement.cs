using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Persistence;

namespace Infrastructure.Security
{
    //This class will be used for authenticating the host against edit and delete activity
    //We're allowing only the host to delete or edit an activity
    public class IsHostRequirement : IAuthorizationRequirement
    {
        
    }

    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DataContext _context;

        public IsHostRequirementHandler(IHttpContextAccessor httpContextAccessor, DataContext context)
        {
            _httpContextAccessor = httpContextAccessor;
            _context = context;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            //Getting the current username
            var currentUserName = _httpContextAccessor.HttpContext.User?.Claims?.SingleOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            //Getting the activity ID (which is stored as a GUID)
            var activityId = Guid.Parse(_httpContextAccessor.HttpContext.Request.RouteValues.SingleOrDefault(x => x.Key == "id").Value.ToString());

            //getting the activity
            var activity = _context.Activities.FindAsync(activityId).Result;

            //getting the host (this returns a UserActivity object)
            var host = activity.UserActivities.FirstOrDefault(x => x.IsHost);

            //check if the current username is equal to the activity host username (accessing the UserActivity object and get the UserName from AppUser object contain within it)
            //if the username matches pass the "requirement" to the middleware
            if (host?.AppUser?.UserName == currentUserName)
                context.Succeed(requirement);

            //return task completion status (if not matches the above conditions, this'll return  403 forbidden)
            return Task.CompletedTask;
        }
    }

}