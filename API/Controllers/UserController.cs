using System.Threading.Tasks;
using Application.User;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //This is controller for handling users
    //Base path for this API will be [<hostname>/api/User]
    public class UserController : BaseController
    {
        // [AllowAnonymous] - will exempt from authenticating - hence can be access without a token.
        [AllowAnonymous]
        //route for login will be [<hostname>/api/User/login]
        [HttpPost("login")]

        //Returning the User
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        // [AllowAnonymous] - will exempt from authenticating - hence can be access without a token.
        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(Register.Command command)
        {
            return await Mediator.Send(command);
        }

        //getting the current user
        //Since we've not defined any paths, the end  point for this will be  http://<Host>/api/user. It'll get controller name (which is User)
        [HttpGet]
        public async Task<ActionResult<User>> currentUser() 
        {
            return await Mediator.Send(new CurrentUser.Query());
        }
    }
}