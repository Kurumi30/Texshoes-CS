using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using texshoes.Models;

namespace texshoes.Data
{
    public static class SeedData
    {
        private static readonly JsonSerializerOptions _jsonSerializerOptions = new()
        {
            PropertyNameCaseInsensitive = true
        };

        public static void Initialize(IServiceProvider serviceProvider)
        {
            using var context = new TexShoesDbContext(
                serviceProvider.GetRequiredService<DbContextOptions<TexShoesDbContext>>());

            if (context.Shoes.Any())
            {
                return;
            }

            var json = File.ReadAllText("wwwroot/src/stock.json");

            var shoes = JsonSerializer.Deserialize<List<Shoe>>(json, _jsonSerializerOptions);

            if (shoes != null)
            {
                context.Shoes.AddRange(shoes);
                context.SaveChanges();
            }
        }
    }
}
