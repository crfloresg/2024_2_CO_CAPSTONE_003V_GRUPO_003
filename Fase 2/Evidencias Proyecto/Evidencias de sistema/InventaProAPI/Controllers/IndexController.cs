using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace InventaProAPI.Controllers
{
  [Route("")]
  [ApiController]
  public class IndexController : ControllerBase
  {

    [HttpGet]
    public IActionResult GetApi()
    {
      return Ok(new { Message = "API working" }); ;
    }


  }
}
