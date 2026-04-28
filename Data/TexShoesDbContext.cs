using Microsoft.EntityFrameworkCore;
using texshoes.Models;

namespace texshoes.Data
{
    public class TexShoesDbContext(DbContextOptions<TexShoesDbContext> options) : DbContext(options)
    {
        public DbSet<Shoe> Shoes { get; set; }
        public DbSet<Cart> Carts { get; set; }
        public DbSet<CartItem> CartItems { get; set; }
    }
}
