using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities.Errors;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class DeleteActivity
    {
        public class Command : IRequest
        {
            public Guid Id {set; get;}
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken){

                var activity = await _context.Activities.FindAsync(request.Id);
                
                if(activity == null){
                    //throwing exceptions such as not found activity [404] using the custom middleware
                    throw new RestExceptions(HttpStatusCode.NotFound, new {activity = "Not found"});
                }

                _context.Remove(activity);

                var success =  await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}