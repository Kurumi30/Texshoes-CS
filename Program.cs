using Microsoft.EntityFrameworkCore;
using texshoes.Data;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var port = Environment.GetEnvironmentVariable("PORT") ?? "5251";

Console.WriteLine($"A porta configurada é: {port}");

// Add services to the container.
builder.Services.AddDbContext<TexShoesDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

// Add services for Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// builder.Services.AddCors(options =>
// {
//     options.AddDefaultPolicy(policy =>
//     {
//         if (builder.Environment.IsDevelopment())
//         {
//             policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod();
//         }
//         else
//         {
//             policy.WithOrigins("https://kurumi30.github.io").AllowAnyHeader().AllowAnyMethod();
//         }
//     });
// });

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Apply migrations and seed the database at startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var dbContext = services.GetRequiredService<TexShoesDbContext>();
    
    dbContext.Database.Migrate();
    SeedData.Initialize(services);
}

// Puxa o html da pasta wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseRouting();

app.UseCors();

app.MapControllers();

app.MapGet("/routes", (IEnumerable<EndpointDataSource> EndpointSource) =>
{
    var endpoints = EndpointSource
        .SelectMany(es => es.Endpoints)
        .OfType<RouteEndpoint>()
        .Select(endpoint => new
        {
            Method = endpoint.Metadata.GetMetadata<IHttpMethodMetadata>()?.HttpMethods is [var first, ..] ? first : null,
            Path = endpoint.RoutePattern.RawText,
            Handler = endpoint.DisplayName,
        })
        .Where(route => !string.IsNullOrEmpty(route.Path) && route.Path != "/routes" && !route.Path.StartsWith("/_"))
        .OrderBy(x => x.Path)
        .ToList();

    return Results.Ok(endpoints);
});

app.Lifetime.ApplicationStarted.Register(() =>
{
    Console.WriteLine("--> A aplicação foi iniciada.");
    Console.WriteLine("--> Pressione Ctrl+C para parar.");
    foreach (var adress in app.Urls)
    {
        Console.WriteLine($"--> URLs disponíveis: {adress}");
    }
});

app.Run($"http://0.0.0.0:{port}");
