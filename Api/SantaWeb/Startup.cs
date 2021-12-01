using System;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Identity.Web;
using SantaWeb.Infrastructure;

namespace SantaWeb
{
    public class Startup
    {
        readonly string AllowSpecificOrigins = "_myAllowSpecificOrigins";

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            Env = env;
        }

        public IConfiguration Configuration { get; }
        public IWebHostEnvironment Env { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddHealthChecks();

            var settingsSection = Configuration.GetSection("ApiSettings");
            var interimSettings = new ApiSettings();
            settingsSection.Bind(interimSettings);

            services.Configure<ApiSettings>(settingsSection);

            services.AddCors(options =>
            {
                Console.WriteLine($"Adding Cors for origins: {string.Join(',', interimSettings.Cors)}.");
                options.AddPolicy(name: AllowSpecificOrigins,
                    builder =>
                    {
                        foreach (var origin in interimSettings.Cors)
                        {
                            builder = builder.WithOrigins(origin);
                        }

                        builder.WithHeaders("authorization")
                            .WithHeaders("Content-Type");
                    });
            });

            services.AddControllers();
            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(Configuration);
            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();

            app.UseRouting();

            app.UseCors(AllowSpecificOrigins);

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}