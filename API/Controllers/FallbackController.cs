using System.IO;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{

    //The FallbackController extends Controller which will return a view in .NET and which will be Index.html page residing "wwwroot"

    [AllowAnonymous]
    public class FallbackController : Controller
    {
        public IActionResult Index () 
        {
            return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "index.html"), "text/HTML");
        }
    }
}