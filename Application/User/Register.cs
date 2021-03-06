using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Activities.Errors;
using Application.Interfaces;
using Application.Validators;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.User
{
    public class Register
    {
        public class Command : IRequest<User>
        {
            public string DisplayName { get; set; }

            public string Username { get; set; }
            public string Email { get; set; }
            public string Password { get; set; }

        }

        //Adding fluent validation
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
                RuleFor(x => x.Username).NotEmpty();
                RuleFor(x => x.Email).EmailAddress().NotEmpty();

                //using Fluent validation chaining
                // RuleFor(x => x.Password).NotEmpty().MinimumLength(6).
                //     WithMessage("Password must be at least 6 characters").Matches("[A-Z]").
                //     WithMessage("Password must contain 1 uppercase letter");

                //Using the custom extension of IRuleBuilder written for validating password
                //The custom implementation is found in "Reactivity\Application\Validators\ValidatorExtensions.cs"
                RuleFor(x => x.Password).Password();
            }
        }

        public class Handler : IRequestHandler<Command, User>
        {
            private readonly DataContext _context;
            private readonly ILogger _logger;
            private readonly UserManager<AppUser> _userManager;
            private readonly IJwtGenerator _jwtGenerator;

            //Injecting DataContext, ILogger, UserManager, IJwtGenerator
            public Handler(DataContext context, ILogger<Register> logger, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
            {
                _jwtGenerator = jwtGenerator;
                _userManager = userManager;
                _logger = logger;
                _context = context;
            }

            //Returning the type User
            public async Task<User> Handle(Command request, CancellationToken cancellationToken)
            {
                //check if the user has already signed in using the same email (this will return a true or false)
                if (await _context.Users.Where(x => x.Email == request.Email).AnyAsync())
                {
                    //throw an error if the user already exist using our own exception class (RestExceptions)
                    throw new RestExceptions(HttpStatusCode.BadRequest, new { Email = "Email already exists" });
                }

                //check if the user has already signed in using the same username (this will return a true or false)
                if (await _context.Users.Where(x => x.UserName == request.Username).AnyAsync())
                {
                    //throw an error if the user already exist using our own exception class (RestExceptions)
                    throw new RestExceptions(HttpStatusCode.BadRequest, new { Username = "Username already exists" });
                }

                var user = new AppUser
                {
                    DisplayName = request.DisplayName,
                    Email = request.Email,
                    UserName = request.Username
                };

                var results = await _userManager.CreateAsync(user);

                if (results.Succeeded)
                {
                    return new User
                    {
                        DisplayName = user.DisplayName,
                        Token = _jwtGenerator.CreateToken(user),
                        Username = user.UserName,
                        Image = null
                    };
                }

                throw new Exception("Problem creating user");

            }
        }
    }
}