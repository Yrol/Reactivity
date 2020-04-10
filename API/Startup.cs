using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Middleware;
using Application.Activities;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation.AspNetCore;
using Infrastructure.Security;
using MediatR;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Persistence;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //Adding the DataContext defined the Persistence project to make it available in runtime
            //Adding the DataContext will also make sure its available for dependency injection
            //Using the lambda expression for "opt"
            //We're using the "Configuration" injected in to this class above to access connection strings
            //The "Configuration" has reference to the "ConnectionStrings" defined in appsetting.json file (part of GetConnectionString)
            //Within the "ConnectionStrings" object in appsetting.json file we define "DefaultConnection"
            services.AddDbContext<DataContext>(opt =>{
                opt.UseLazyLoadingProxies();
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });

            //Allowing Cross Origin in out project as a service
            services.AddCors(opt => 
            {
                opt.AddPolicy("CorsPolicy", policy => 
                {
                    //http://localhost:3000/ and http://localhost:3001 is the frontend React URL
                    policy
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .WithExposedHeaders("WWW-Authenticate")//this will expose the authentication header information in the 401 response which'll be used to capture at the frontend if an authentication related error occured. Ex:- ** headers:www-authenticate: "Bearer error="invalid_token", error_description="The token expired at '04/10/2020 12:37:47'"" **
                        .WithOrigins(new string[]{"http://localhost:3000","http://localhost:3001"});
                });
            });

            //Specifying the MediatR for injection. We only need to reference one place where the MediatR can be used within the project - this is the Assembly (in this case it is ActivitiesList handler)
            services.AddMediatR(typeof(ActivitiesList.Handler).Assembly);

            //Specifying the AutoMapper for injection. We only need to reference one place where the MediatR can be used within the project - this is the Assembly (in this case it is ActivitiesList handler)
            services.AddAutoMapper(typeof(ActivitiesList.Handler).Assembly);

            services.AddMvc(); // Dependency Injection for MVC services

            services.AddControllers(opt => {

                //Adding the Authorization policy to all the controller, and for the ones we don't need, we can add the exception "[AllowAnonymous]" - can be added to individual controllers as well as to the methods inside them
                var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
                opt.Filters.Add(new AuthorizeFilter(policy)); 
            })
                //Binding the Fluent validator to the Controllers and specify which controller is going to use it (in this case 'CreateActivity')
                .AddFluentValidation(cfg => {
                    cfg.RegisterValidatorsFromAssemblyContaining<CreateActivity>();
                });

                //This is to rectify the error in HTTP response - "A possible object cycle was detected which is not supported. This can either be due to a cycle or if the object depth is larger than the maximum allowed depth of 32"
                //.AddNewtonsoftJson(x => x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

            //Configuring ASP .NET Core Identity
            var builder = services.AddIdentityCore<AppUser>();// Adding the AddIdentityCore and letting know about the custom user entity AppUser
            var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
            identityBuilder.AddEntityFrameworkStores<DataContext>();
            identityBuilder.AddSignInManager<SignInManager<AppUser>>();//will be used to sign-in the user using username and password

            //passing the authorization for deleting/editing an activity by the host of the activity
            services.AddAuthorization(opt => {
                opt.AddPolicy("IsActivityHost", policy => 
                {
                    policy.Requirements.Add(new IsHostRequirement());
                });
            });

            services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

            //"configuration["TokenKey"]" is the Key that has been generated using "dotnet user-secrets set "TokenKey" "super secret key" -p .\API\"
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Tokenkey"]));

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(opt => {
                    //Define what parameters need to be validated when a token is received
                    opt.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = key,
                        ValidateAudience = false,
                        ValidateIssuer = false,

                        //validating the expiry of the token (If the token is expires, it'll return a 401)
                        ValidateLifetime = true, //enable validation period defined in jwtGenerator.cs
                        ClockSkew = TimeSpan.Zero // The above ValidateLifetime property allows extra 5 mins by default and ClockSkew will eliminate this extra 5 min
                    };
                });

            //adding the IJwtGenerator (interface) and the concrete implementation of it JwtGenerator through services
            //By doing this, the constrcutors of our classes have access to these and their methods
            services.AddScoped<IJwtGenerator, JwtGenerator>();

            //adding the IUserAccessor (interface) and the concrete implementation of it UserAccessor through services
            services.AddScoped<IUserAccessor, UserAccessor>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            //app.UseMiddleware<ErrorHandlingMiddleware>();//adding the 
            if (env.IsDevelopment())
            {
                 app.UseMiddleware<ErrorHandlingMiddleware>();//Hooking the custom middleware that handles exceptions
                //app.UseDeveloperExceptionPage();// turning off the inbuilt exception
            }

            //disable/enable HTTPS. eg: https://localhost:5000/
            //app.UseHttpsRedirection();

            //The following order is important

            app.UseRouting();
            //Enabling Cross Origin added above in ConfigureServices as a Middleware
            app.UseCors("CorsPolicy");

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
