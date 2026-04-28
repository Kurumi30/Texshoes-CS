using Microsoft.EntityFrameworkCore;
using texshoes.Models;

namespace texshoes.Data
{
    public class TexShoesDbContext(DbContextOptions<TexShoesDbContext> options) : DbContext(options)
    {
        public DbSet<Shoe> Shoes { get; set; } = null!;
        public DbSet<Cart> Carts { get; set; } = null!;
        public DbSet<CartItem> CartItems { get; set; } = null!;
    }
}
