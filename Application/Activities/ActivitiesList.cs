using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{

    //This class will be used for returning list of all activities
    public class ActivitiesList
    {
        //public class Query : IRequest<List<Activity>> //used this before introduced DTO (ActivityDto) which returns just the object
        public class Query : IRequest<List<ActivityDto>>
        { }

        //We've used the following "public class Handler" with the Activity object before introducing the ActivityDto
        //public class Handler : IRequestHandler<Query, Activity>>
        public class Handler : IRequestHandler<Query, List<ActivityDto>>
        {
            private readonly DataContext _context;
            private readonly ILogger _logger;
             private readonly IMapper _mapper;

            //Passing the IMapper for mapping data between DTO object (ActivityDto) and Activity object 
            public Handler(DataContext context, ILogger<ActivitiesList> logger, IMapper mapper)
            {
                _logger = logger;
                _context = context;
                _mapper = mapper;
            }

            //We've used the following "async Task "with the return type Activity object before introducing the ActivityDto (DTO pattern)
            //public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                _logger.LogInformation($"ActivitiesList Executed");

                //returning activities without any relative data
                //var activities = await _context.Activities.ToListAsync(cancellationToken);

                
                //Loading related data - following will not only get activities but also AppUser of each activity
                // var activities = await _context.Activities
                //     .Include(x => x.UserActivities)
                //     .ThenInclude(x => x.AppUser)
                //     .ToListAsync();
                // 
                // return activities;

                //Lazy loading
                var activities = await _context.Activities
                    .ToListAsync(cancellationToken);

                //returning a list of activities after mapping the data
                return _mapper.Map<List<Activity>, List<ActivityDto>>(activities);
            }
        }
    }
}