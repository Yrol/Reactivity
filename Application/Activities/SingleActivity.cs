using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities.Errors;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class SingleActivity
    {
        //public class Query : IRequest<Activity> //used this before introduced DTO (ActivityDto) which returns just the object
        public class Query : IRequest<ActivityDto>
        {
            public Guid Id { get; set; }
        }

        //We've used the following "public class Handler" with the Activity object before introducing the ActivityDto
        //public class Handler : IRequestHandler<Query, Activity>
        public class Handler : IRequestHandler<Query, ActivityDto>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            //injection DataContext and AutoMapper
             //Passing the IMapper for mapping data between DTO object (ActivityDto) and Activity object 
            public Handler(DataContext context, IMapper mapper)
            {
                _context = context;
                _mapper = mapper;
            }

            //We've used the following "async Task "with the return type Activity object before introducing the ActivityDto (DTO pattern)
            //public async Task<Activity> Handle(Query request, CancellationToken cancellationToken)
            public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
            {
                //throw a 500 error intentionally for testing
                //throw new Exception("Throwing a 500 server error intentionally");

                //Return an activity without any relationship
                //var activity = await _context.Activities.FindAsync(request.Id);

                //Return an activity with relative data which includes AppUser of the activity
                //The following way of loading data is known as "Eager loading" that uses statements such as "Include" and "ThenInclude"
                // var activity = await _context.Activities
                //     .Include(x => x.UserActivities)
                //     .ThenInclude(x => x.AppUser)
                //     .SingleOrDefaultAsync(x => x.Id == request.Id);

                //Lazy loading
                var activity = await _context.Activities
                    .FindAsync(request.Id);


                if(activity == null){
                    //throwing exceptions such as not found activity [404] using the custom middleware
                    throw new RestExceptions(HttpStatusCode.NotFound, new {activity = "Not found"});
                }

                //return activity; // returning just the activity - when using without AutoMapper

                //doing the mapping based on Activity and ActivityDto
                var activityToReturn = _mapper.Map<Activity, ActivityDto>(activity);
                return activityToReturn;
            }
        }
    }
}