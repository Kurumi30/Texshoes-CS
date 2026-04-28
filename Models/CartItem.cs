namespace texshoes.Models
{
    public class CartItem
    {
        public int Id { get; set; }
        public int ShoeId { get; set; }
        public Shoe Shoe { get; set; } = null!;
        public int Quantity { get; set; }
        public int CartId { get; set; }
        public Cart Cart { get; set; } = null!;
    }
}
