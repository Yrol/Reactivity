using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities.Errors;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class SingleActivity
    {
        public class Query : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }

        //We've used the following "public class Handler" with the Activity object before introducing the ActivityDto
        //public class Handler : IRequestHandler<Query, Activity>
        public class Handler : IRequestHandler<Query, ActivityDto>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            //We've used the following "async Task "with the Activity object before introducing the ActivityDto
            //public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {
                //throw a 500 error intentionally for testing
                //throw new Exception("Throwing a 500 server error intentionally");

                //Return an activity without any relationship
                //var activity = await _context.Activities.FindAsync(request.Id);

                //Return an activity with relative data which includes AppUser of the activity
                var activity = await _context.Activities
                    .Include(x => x.UserActivities)
                    .ThenInclude(x => x.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if(activity == null){
                    //throwing exceptions such as not found activity [404] using the custom middleware
                    throw new RestExceptions(HttpStatusCode.NotFound, new {activity = "Not found"});
                }

                //return activity;
                
            }
        }
    }
}