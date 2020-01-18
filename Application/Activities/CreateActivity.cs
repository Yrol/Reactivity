using System;
using System.ComponentModel.DataAnnotations;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class CreateActivity
    {
        //This class will be used for creating an activity
        //Unlike the ActivitiesList and SingleActivity, this is a command (as opposed to a query)
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime Date { get; set; }
            public string City { get; set; }
        }

        //This The Fluent Validation class which will use the "Command" class above to do the validation for required fields
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Title).NotEmpty();
                RuleFor(x => x.Description).NotEmpty();
                RuleFor(x => x.Category).NotEmpty();
                RuleFor(x => x.Date).NotEmpty();
                RuleFor(x => x.City).NotEmpty();
            }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = new Activity
                {
                    Id = request.Id,
                    Title = request.Title,
                    Description = request.Description,
                    Category = request.Category,
                    Date = request.Date,
                    City = request.City
                };

                //we're NOT using AddAsync since it's ideal when only doing special value generation through sql db
                _context.Activities.Add(activity);

                //SaveChangesAsync returs a value boolean greater than 0 is successfully added to the DB
                var success = await _context.SaveChangesAsync() > 0;

                //returning the success as the type Unit
                if (success) return Unit.Value;

                //if not success throw an exception
                throw new Exception("Problem saving changes");
            }
        }
    }
}