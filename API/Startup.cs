using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Activities;
using FluentValidation.AspNetCore;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
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
            //Adding the DataContext will also make sure its available for dependancy injection
            //Using the lambda expression for "opt"
            //We're using the "Configuration" injected in to this class above to access connection strings
            //The "Configuration" has reference to the "ConnectionStrings" defined in appsetting.json file (part of GetConnectionString)
            //Within the "ConnectionStrings" object in appsetting.json file we define "DefaultConnection"
            services.AddDbContext<DataContext>(opt =>{
                opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
            });

            //Allowing Cross Origin in out project as a service
            services.AddCors(opt => 
            {
                opt.AddPolicy("CorsPolicy", policy => 
                {
                    //http://localhost:3000/ and http://localhost:3001 is the frontend React URL
                    policy.AllowAnyHeader().AllowAnyMethod().WithOrigins(new string[]{"http://localhost:3000","http://localhost:3001"});
                });
            });

            //Specifying the MediatR for injection. We only need to reference one place where the MediatR has been used and it can be used in other places
            services.AddMediatR(typeof(ActivitiesList.Handler).Assembly);

            services.AddControllers()
                //Binding the Fluent validator to the Controllers and specify the controller which is going to use it (in this case 'CreateActivity')
                .AddFluentValidation(cfg => {
                    cfg.RegisterValidatorsFromAssemblyContaining<CreateActivity>();
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            //Enabling Cross Origin added above in ConfigureServices as a Middleware
            app.UseCors("CorsPolicy");

            //disable/enable HTTPS. eg: https://localhost:5000/
            //app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
