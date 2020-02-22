using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
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
        public class Query : IRequest<List<Activity>>
        { }

        public class Handler : IRequestHandler<Query, List<Activity>>
        {
            private readonly DataContext _context;
            private readonly ILogger _logger;
            public Handler(DataContext context, ILogger<ActivitiesList> logger)
            {
                _logger = logger;
                _context = context;
            }
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                _logger.LogInformation($"ActivitiesList Executed");

                //returning activities without any relative data
                //var activities = await _context.Activities.ToListAsync(cancellationToken);

                
                //Loading related data - following will not only get activities but also AppUser of each activity
                // var activities = await _context.Activities
                //     .Include(x => x.UserActivities)
                //     .ThenInclude(x => x.AppUser)
                //     .ToListAsync();

                //Lazy loading
                var activities = await _context.Activities
                    .ToListAsync();

                return activities;
            }
        }
    }
}