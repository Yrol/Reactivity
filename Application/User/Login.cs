using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities.Errors;
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
            private readonly UserManager<AppUser> _userManager;
            private readonly SignInManager<AppUser> _signInManager;
            public Handler(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
            {
                _userManager = userManager;
                _signInManager = signInManager;
            }

            //returning AppUser
            public async Task<AppUser> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await _userManager.FindByEmailAsync(request.Email);

                //if the user is not found throw an exception
                if (user == null){
                    throw new RestExceptions(HttpStatusCode.Unauthorized);
                }

                //check password when signing in
                //the 'false' will make sure the user will NOT be lockedout in case of failure attempt
                var results = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);

                //if login is successful
                if  (results.Succeeded)
                {
                    //TO do generate token
                    return user;
                }

                throw new RestExceptions(HttpStatusCode.Unauthorized);
            }
        }
    }
}