using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.User
{
    //this class will get the currently logged in user
    public class CurrentUser
    {
        public class Query : IRequest<User>
        { }

        public class Handler : IRequestHandler<Query, User>
        {
            private readonly UserManager<AppUser> _usermanager;
            private readonly IJwtGenerator _jwtgenerator;
            private readonly IUserAccessor _userAccessor;
            private readonly ILogger _logger;
            public Handler(UserManager<AppUser> usermanager, IJwtGenerator jwtgenerator, IUserAccessor userAccessor, ILogger<CurrentUser> logger)
            {
                _usermanager = usermanager;
                _jwtgenerator = jwtgenerator;
                _userAccessor = userAccessor;
                _logger = logger;
            }

            public async Task<User> Handle(Query request, CancellationToken cancellationToken)
            {
                //getting the username using FindByNameAsync
                var user = await _usermanager.FindByNameAsync(_userAccessor.GetCurrentUsername());

                return new User
                {
                    DisplayName = user.UserName,
                    Username = user.UserName,
                    Token = _jwtgenerator.CreateToken(user),
                    Image = null
                };
            }
        }
    }
}