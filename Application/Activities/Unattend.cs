using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities.Errors;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    //This Class will be used to remove a user/attendee from an activity
    public class Unattend
    {
        //This Class will be used to add a user to the attendee list of an activity
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            //IUserAccessor to access user token
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                //getting the activity by ID
                var activity = await _context.Activities.FindAsync(request.Id);

                //if activity is not found throw and error
                if (activity == null) 
                    throw new RestExceptions(HttpStatusCode.NotFound, new {Activity = "Could not find activity"});

                //getting the current user by using the username saved inside the token
                var user = await _context.Users.SingleOrDefaultAsync(x => x.UserName == _userAccessor.GetCurrentUsername());

                //check if the user is an attendee of the given activity
                var attendance = await _context.UserActivities
                    .SingleOrDefaultAsync(x => x.ActivityId == activity.Id && x.AppUserId == user.Id);

                //if the user is not found to be an attendee, then exit out of this handler
                if (attendance == null)
                    return Unit.Value;

                //check if the use is the host of the activity. In that case it'll prevent removing and throw and exception
                if (attendance.IsHost)
                    throw new RestExceptions(HttpStatusCode.BadRequest, new {Attendance = "You cannot remove yourself as host"});

                //remove the attendee
                _context.UserActivities.Remove(attendance);

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}