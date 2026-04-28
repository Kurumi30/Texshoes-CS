using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;

namespace texshoes.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController(IWebHostEnvironment hostingEnvironment) : ControllerBase
    {
        [HttpGet("{imageName}")]
        public IActionResult GetImage(string imageName)
        {
            var wwwRootPath = hostingEnvironment.WebRootPath;
            var imagePath = Path.Combine(wwwRootPath, "src", "images", imageName);

            if (!System.IO.File.Exists(imagePath)) return NotFound();

            var provider = new FileExtensionContentTypeProvider();
            
            if (!provider.TryGetContentType(imagePath, out var contentType))
            {
                contentType = "application/octet-stream";
            }

            var imageBytes = System.IO.File.ReadAllBytes(imagePath);

            return File(imageBytes, contentType);
        }
    }
}
