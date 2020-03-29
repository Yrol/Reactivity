using System.Collections.Generic;
using System.Linq;
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
        public class ActivitiesEnevelope
        {
            public List<ActivityDto> Activities { get; set; }
            public int ActivityCount { get; set; }
        }

        //Ver1: public class Query : IRequest<List<Activity>> - used this before introducing Data Transfer Object (DTO) (ActivityDto) which returns just the object
        //Ver2: public class Query : IRequest<List<ActivityDto>> - Used to return ActivityDto before introducing the ActivitiesEnevelope which returns ActivityDto
        public class Query : IRequest<ActivitiesEnevelope>
        {
            //setting the limit and offset for activties (optional)
            //limit is to limit the number of activities and the offset to skip the number of activities from all the activities 
            public Query(int? limit, int? offset)
            {
                Limit = limit;
                Offset = offset;
            }

            public int? Limit { get; set; }
            public int? Offset { get; set; }
        }

        //Ver1 - We've used the following "public class Handler" with the Activity object before introducing the ActivityDto
        //public class Handler : IRequestHandler<Query, Activity>>

        //Ver2 - "public class Handler : IRequestHandler<Query, List<ActivityDto>>" - Used to return ActivityDto before introducing the ActivitiesEnevelope which returns ActivityDto
        public class Handler : IRequestHandler<Query, ActivitiesEnevelope>
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

            //Ver1: We've used the following "async Task "with the return type Activity object before introducing the ActivityDto (DTO pattern)
            //public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)

            //Ver2: "public async Task<List<ActivityDto>> Handle(Query request, CancellationToken cancellationToken)" - we used to return ActivityDto before introducing the ActivitiesEnevelope which returns ActivityDto
            public async Task<ActivitiesEnevelope> Handle(Query request, CancellationToken cancellationToken)
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

                var queryable = _context.Activities.AsQueryable();

                //Lazy loading
                //ver1: var activities = await _context.Activities.ToListAsync(cancellationToken); -  before queryable introduced which does not return activities along with a limit or an offset

                //if the offset is not set it'll be defaulted to 0, then will set the number of items to be returned, if that's not set already will be set to 3 items
                var activities =  await queryable.Skip(request.Offset ?? 0).Take(request.Limit ?? 3).ToListAsync();

                //returning a list of activities after mapping the data
                //Ver1: return _mapper.Map<List<Activity>, List<ActivityDto>>(activities) - 

                return new ActivitiesEnevelope
                {
                    Activities = _mapper.Map<List<Activity>, List<ActivityDto>>(activities),
                    ActivityCount = queryable.Count()
                };
            }
        }
    }
}