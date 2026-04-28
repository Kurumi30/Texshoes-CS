using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using texshoes.Data;
using texshoes.Models;

namespace texshoes.Controllers
{
    // DTO para receber os dados da requisição
    public class AddToCartDto
    {
        public int ShoeId { get; set; }
        public int? CartId { get; set; }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class CartController(TexShoesDbContext context) : ControllerBase
    {

        // GET: api/cart/5
        [HttpGet("{cartId}")]
        public async Task<ActionResult<Cart>> GetCart(int cartId)
        {
            var cart = await context.Carts
                .Include(c => c.Items) 
                .ThenInclude(i => i.Shoe) 
                .FirstOrDefaultAsync(c => c.Id == cartId);

            if (cart == null)
            {
                return NotFound("Cart not found.");
            }

            return Ok(cart);
        }

        // POST: api/cart
        [HttpPost]
        public async Task<ActionResult<Cart>> AddToCart([FromBody] AddToCartDto dto)
        {
            var shoe = await context.Shoes.FindAsync(dto.ShoeId);
            if (shoe == null)
            { 
                return NotFound("Shoe not found.");
            }

            Cart? cart = null; 
            if (dto.CartId.HasValue)
            {
                cart = await context.Carts
                    .Include(c => c.Items)
                    .FirstOrDefaultAsync(c => c.Id == dto.CartId.Value);
            }

            if (cart == null)
            {
                cart = new Cart();
                context.Carts.Add(cart);
                await context.SaveChangesAsync(); // Salva o carrinho para gerar um ID
            }

            var existingItem = cart.Items.FirstOrDefault(i => i.ShoeId == dto.ShoeId);
            if (existingItem != null)
            {
                existingItem.Quantity++;
            }
            else
            {
                var cartItem = new CartItem
                {
                    ShoeId = dto.ShoeId,
                    Shoe = shoe,
                    Quantity = 1,
                    CartId = cart.Id, 
                    Cart = cart 
                };
                cart.Items.Add(cartItem);
            }

            await context.SaveChangesAsync();

            return Ok(cart);
        }

        // POST: api/cart/item/5/increase
        [HttpPost("item/{itemId:int}/increase")]
        public async Task<ActionResult<Cart>> IncreaseQuantity(int itemId)
        {
            var cartItem = await context.CartItems.FindAsync(itemId);
            if (cartItem == null) return NotFound("Item not found");

            cartItem.Quantity++;
            await context.SaveChangesAsync();

            return await GetCart(cartItem.CartId);
        }

        // POST: api/cart/item/5/decrease
        [HttpPost("item/{itemId:int}/decrease")]
        public async Task<ActionResult<Cart>> DecreaseQuantity(int itemId)
        {
            var cartItem = await context.CartItems.FindAsync(itemId);
            if (cartItem == null) return NotFound("Item not found");

            cartItem.Quantity--;

            if (cartItem.Quantity <= 0)
            {
                context.CartItems.Remove(cartItem);
            }
            await context.SaveChangesAsync();

            return await GetCart(cartItem.CartId);
        }

        // DELETE: api/cart/item/5
        [HttpDelete("item/{itemId:int}")]
        public async Task<ActionResult<Cart>> RemoveItem(int itemId)
        {
            var cartItem = await context.CartItems.FindAsync(itemId);
            if (cartItem == null) return NotFound("Item not found");

            int cartId = cartItem.CartId;
            context.CartItems.Remove(cartItem);
            await context.SaveChangesAsync();

            return await GetCart(cartId);
        }
    }
}
