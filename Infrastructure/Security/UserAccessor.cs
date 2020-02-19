using System.Linq;
using System.Security.Claims;
using Application.Interfaces;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Security
{
    public class UserAccessor : IUserAccessor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        //Injecting IHttpContextAccessor in order to access the token which contains the username
        public UserAccessor(IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        //getting the currently logged in user by matching through the token
        public string GetCurrentUsername()
        {
            //Accessing the User object inside the HttpContext and if the User object exist, get the matching user via the Claims identifier
            var username = _httpContextAccessor.HttpContext.User?.Claims?.FirstOrDefault
            (x => x.Type == ClaimTypes.NameIdentifier)?.Value;

            return username;
        }
    }
}