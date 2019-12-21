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
                var activities = await _context.Activities.ToListAsync();
                return activities;
            }
        }
    }
}