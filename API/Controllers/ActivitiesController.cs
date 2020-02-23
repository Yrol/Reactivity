using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    //In the API route url  this will become [<hostname>/api/Activities] - the word "Controller" from "ActivitiesController" will be dropped. ex:http://localhost:5000/api/Activities/ 
    // [Route("api/[controller]")]
    // [ApiController]
    public class ActivitiesController : BaseController
    {
        // private readonly IMediator _mediator;

        // //Injecting the mediator
        // public ActivitiesController(IMediator mediator)
        // {
        //     _mediator = mediator;
        // }

        //An async task that'll return a List of Activities from the mediator implemented in Activities
        //We're also passing a cancellation token which'll allow the users to cancel the requests from the browser
        // The "Mediator" is coming from the BaseController
        // [AllowAnonymous] - will exempt from authenticating - hence can be access without a token.
        [HttpGet]
        //[AllowAnonymous]
        public async Task<ActionResult<List<Activity>>> GetAll(CancellationToken ct)
        {
            return await Mediator.Send(new ActivitiesList.Query(), ct);
        }

        //get a single activity by ID
        [HttpGet("{id}")]
        //[Authorize] - Authorize will enforce the endpoint to be authenticated
        [AllowAnonymous]
        //public async Task<ActionResult<Activity>> Get(Guid id){
        public async Task<ActionResult<ActivityDto>> Get(Guid id){
            return await Mediator.Send(new SingleActivity.Query{Id = id});
        }

        //Create a new Activity
        //Since we're using the [ApiController] above, its smart enough to figure out the objects that the create command needs. Otherwise we've to use "[FromBody]CreateActivity.Command"
        [HttpPost]
        [AllowAnonymous]
        public async Task<ActionResult<Unit>> Create(CreateActivity.Command command){
            return await Mediator.Send(command);
        }

        //Editing an activity
        //Passing the Authorize policy "IsActivityHost" which enables only the host of the activity to edit the activity
        [HttpPut("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Edit(Guid id, EditActivity.Command command){
            command.Id = id;
            return await Mediator.Send(command);
        }

        //Passing the Authorize policy "IsActivityHost" which enables only the host of the activity to delete the activity
        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid id){
            return await Mediator.Send(new DeleteActivity.Command{Id = id});
        }

        //Endpoint to add a user as an attendee to an activity (POST)
        //Endpoint: <id>/attend
        //API call example: [POST]http://localhost:5000/api/activities/68cd87e1-1ebf-4364-a56d-95aa7cc9cc3b/attend
        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            return await Mediator.Send(new Attend.Command{Id = id});
        }

        //Endpoint to remove an attendee from an activity (DELETE)
        //Endpoint: <id>/attend
        //API call example: [DELETE]http://localhost:5000/api/activities/68cd87e1-1ebf-4364-a56d-95aa7cc9cc3b/attend
        [HttpDelete("{id}/attend")]
        public async Task<ActionResult<Unit>> Unattend(Guid id)
        {
            return await Mediator.Send(new Unattend.Command{Id = id});
        }

    }
}