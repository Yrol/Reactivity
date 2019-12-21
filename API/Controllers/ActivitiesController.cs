using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;

        //Injecting the mediator
        public ActivitiesController(IMediator mediator)
        {
            _mediator = mediator;
        }

        //An async task that'll return a List of Activities from the mediator implemented in Activities
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetAll()
        {
            return await _mediator.Send(new ActivitiesList.Query());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> Get(Guid id){
            return await _mediator.Send(new SingleActivity.Query{Id = id});
        }
    }
}