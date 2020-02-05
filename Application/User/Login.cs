using System.Threading;
using System.Threading.Tasks;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Persistence;

namespace Application.User
{
    public class Login
    {
        //returning AppUser
        public class Query : IRequest<AppUser>
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        //using AbstractValidator from FluentValidation
        public class QueryValidator : AbstractValidator<Query>
        {
            public QueryValidator()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }


        //returning AppUser
        public class Handler : IRequestHandler<Query, AppUser>
        {
            public Handler(UserManager<AppUser> userManager, Microsoft.AspNetCore.Identity.SignInManager<AppUser> signInManager)
            {

            }

            //returning AppUser
            public async Task<AppUser> Handle(Query request, CancellationToken cancellationToken)
            {
            }
        }
    }
}