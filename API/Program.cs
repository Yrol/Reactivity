using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Persistence;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var host = CreateHostBuilder(args).Build();

            //Get access to the DataContext via a "using" statement
            //Since we're relying on "using" and "CreateScope", the DataContext will only be available during execution
            //Hence it'll be disposed once the execution ends
            //The "CreateScope" returns an IServiceScope which implements IDisposable
            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try{
                   var context = services.GetRequiredService<DataContext>(); 

                   //The "Migrate" command will create the DB and tables IF not exists (only the pending ones)
                   context.Database.Migrate();
                }
                catch(Exception ex){

                    //Logging errors
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(ex, "An error occured during migration");
                }
            }
            
            //run the host at the end
            host.Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}