using System.ComponentModel.DataAnnotations;

namespace texshoes.Models
{
    public class ShoeCreateModel
    {
        [Required]
        public string Name { get; set; } = null!;
        [Required]
        public string Category { get; set; } = null!;
        [Required]
        public decimal Price { get; set; }
        [Required]
        public IFormFile ImageFile { get; set; } = null!;
    }
}
