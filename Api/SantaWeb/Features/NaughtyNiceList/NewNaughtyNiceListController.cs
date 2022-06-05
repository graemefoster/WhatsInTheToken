using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Identity.Web.Resource;

namespace SantaWeb.Features.NaughtyNiceList
{
    [ApiController]
    [Authorize]
    [Route("[controller]")]
    public class NewNaughtyNiceListController : ControllerBase
    {
        private readonly ILogger<NewNaughtyNiceListController> _logger;
        public NewNaughtyNiceListController(ILogger<NewNaughtyNiceListController> logger)
        {
            _logger = logger;
        }

        [HttpPost]
        [Authorize(Roles = "SeniorContributor")]
        [RequiredScope(new [] {"NaughtyNiceList.Write"})]
        public IActionResult Post(NewNaughtyNice item)
        {
            _logger.LogInformation("Adding new naughty-nice item");
            return Ok();
        }
    }
}