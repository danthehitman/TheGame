using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using TheGameApi.Controllers.Models;
using TheGameApi.Core.Services;
using TheGameApi.DataAccess;
using TheGameApi.Models;

namespace TheGameApi.Controllers
{
    [RoutePrefix("/rest/discovery")]
    public class DiscoveryController : ApiController
    {
        private IDiscoveryRepository _discoveryRepo;

        public DiscoveryController(IDiscoveryRepository discoveryRepo)
        {
            _discoveryRepo = discoveryRepo;
        }

        // GET: api/Discovery
        public IEnumerable<Discovery> Get()
        {
            return _discoveryRepo.All;
        }

        [Route("generate")]
        public async Task<IEnumerable<Discovery>> PostGenerateDiscoveriesAsync([FromBody]DiscoveryGenerateDto dto)
        {
            var user = new AuthService().GetUserFromToken(ControllerUtilities.GetAuthToken(Request));
            return await new DiscoveryService().GenerateDiscoveriesAsync(dto.Point, dto.ItemId, user);
        }

        // GET: api/Discovery/5
        public async Task<Discovery> GetAsync(Guid id)
        {
            return await _discoveryRepo.FindAsync(id);
        }
        
        // POST: api/Discovery
        public async Task PostAsync([FromBody]Discovery value)
        {
        }

        // PUT: api/Discovery/5
        public async Task PutAsync(Guid id, [FromBody]Discovery value)
        {
        }

        // DELETE: api/Discovery/5
        public async Task DeleteAsync(Guid id)
        {
            await _discoveryRepo.DeleteAsync(id);
        }
    }
}
