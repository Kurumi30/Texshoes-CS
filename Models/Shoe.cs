using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace texshoes.Models
{
    public class Shoe
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; } = null!;

        [Required]
        public string Category { get; set; } = null!;

        [Required]
        [Column(TypeName = "decimal(18, 2)")]
        public decimal Price { get; set; }

        public string Image { get; set; } = null!;
    }
}
