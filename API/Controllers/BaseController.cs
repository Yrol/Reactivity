using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.DependencyInjection;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseController : ControllerBase
    {
        private IMediator _mediator;

        //In here we're setting "Mediator" to be _mediator, and if "_mediator" is null we go and get IMediator from services
        protected IMediator Mediator =>_mediator ?? (_mediator = HttpContext.RequestServices.GetService<IMediator>());
    }
}