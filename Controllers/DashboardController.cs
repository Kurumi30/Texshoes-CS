using Microsoft.AspNetCore.Mvc;

namespace texshoes.Controllers;

[ApiController]
[Route("[controller]")]
public class DashboardController(IWebHostEnvironment hostingEnvironment) : ControllerBase
{
    [HttpGet]
    public IActionResult Get()
    {
        var filePath = Path.Combine(hostingEnvironment.ContentRootPath, "wwwroot", "db-table-viewer.html");
        
        return PhysicalFile(filePath, "text/html");
    }
}
