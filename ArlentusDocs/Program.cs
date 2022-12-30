using BusinessLogic;
using BusinessLogic.Concrete.Hubs;
using BusinessLogic.Hubs;
using Common.Mapping;
using DataAccess;
using DataAccess.Concrete;

var builder = WebApplication.CreateBuilder(args);
//var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddContainerWithDependenciesDal();
builder.Services.AddContainerWithDependenciesBll();
//builder.Services.AddDbContext<ArlentusDocsDbContext>(options => options.UseSqlServer(connectionString));
builder.Services.AddDbContext<ArlentusDocsDbContext>();
builder.Services.AddAutoMapper(typeof(MapProfile));

builder.Services.AddCors(option => option.AddDefaultPolicy(policy =>
    policy.AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials()
          .SetIsOriginAllowed(origin => true)
));
builder.Services.AddSignalR();

builder.Services.AddSingleton<ChatHub>();
builder.Services.AddSingleton<ChatHubManager>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<ChatHub>("/myhub");
});

app.Run();
