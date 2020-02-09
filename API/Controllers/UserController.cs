using System.Threading.Tasks;
using Application.User;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //This is controller for handling users
    //Base path for this API will be [<hostname>/api/User]
    // [AllowAnonymous] - will exempt from authenticating - hence can be access without a token.
    [AllowAnonymous]
    public class UserController : BaseController
    {
        //route for login will be [<hostname>/api/User/login]
        [HttpPost("login")]

        //Returning the User
        public async Task<ActionResult<User>> Login(Login.Query query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(Register.Command command)
        {
            return await Mediator.Send(command);
        }
    }
}