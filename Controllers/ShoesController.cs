using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using texshoes.Data;
using texshoes.Models;

namespace texshoes.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShoesController(TexShoesDbContext context, IWebHostEnvironment env) : ControllerBase
    {
        // GET: api/Shoes
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Shoe>>> GetShoes()
        {
            return await context.Shoes.ToListAsync();
        }

        // GET: api/Shoes/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Shoe>> GetShoe(int id)
        {
            var shoe = await context.Shoes.FindAsync(id);

            if (shoe == null)
            {
                return NotFound();
            }

            return shoe;
        }

        // PUT: api/Shoes/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShoe(int id, [FromBody] Shoe shoeUpdateData)
        {
            if (id != shoeUpdateData.Id)
            {
                return BadRequest("ID mismatch");
            }

            var shoeToUpdate = await context.Shoes.FindAsync(id);
            if (shoeToUpdate == null)
            {
                return NotFound();
            }

            shoeToUpdate.Name = shoeUpdateData.Name;
            shoeToUpdate.Category = shoeUpdateData.Category;
            shoeToUpdate.Price = shoeUpdateData.Price;

            try
            {
                await context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!context.Shoes.Any(e => e.Id == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Shoes
        [HttpPost]
        public async Task<ActionResult<Shoe>> PostShoe([FromForm] ShoeCreateModel shoeModel)
        {
            if (shoeModel.ImageFile == null || shoeModel.ImageFile.Length == 0)
            {
                return BadRequest("An image file is required.");
            }

            var shoe = new Shoe
            {
                Name = shoeModel.Name,
                Category = shoeModel.Category,
                Price = shoeModel.Price,
                Image = ""
            };

            context.Shoes.Add(shoe);
            await context.SaveChangesAsync();

            var uploadsFolderPath = Path.Combine(env.ContentRootPath, "wwwroot", "src", "images");
            if (!Directory.Exists(uploadsFolderPath))
            {
                Directory.CreateDirectory(uploadsFolderPath);
            }

            var fileExtension = Path.GetExtension(shoeModel.ImageFile.FileName);
            var fileName = $"model-{shoe.Id}{fileExtension}"; 
            var filePath = Path.Combine(uploadsFolderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await shoeModel.ImageFile.CopyToAsync(stream);
            }

            shoe.Image = $"src/images/{fileName}"; 
            await context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetShoes), new { id = shoe.Id }, shoe);
        }

        // DELETE: api/Shoes/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShoe(int id)
        {
            var shoe = await context.Shoes.FindAsync(id);
            if (shoe == null)
            {
                return NotFound();
            }

            if (!string.IsNullOrEmpty(shoe.Image))
            {
                var imagePath = Path.Combine(env.ContentRootPath, "wwwroot", shoe.Image); 
                if (System.IO.File.Exists(imagePath))
                {
                    System.IO.File.Delete(imagePath);
                }
            }

            context.Shoes.Remove(shoe);
            await context.SaveChangesAsync();

            return NoContent();
        }
    }
}
