using System;
using System.Collections.Generic;
using System.Web.Http;
using TheGameApi.Controllers.Models;
using TheGameApi.Core.Services;
using TheGameApi.DataAccess;
using TheGameApi.Models;

namespace TheGameApi.Controllers
{
    public class DiscoveryController : ApiController
    {
        private DiscoveryRepository _discoveryRepo;

        public DiscoveryController()
        {
            _discoveryRepo = new DiscoveryRepository();
        }

        // GET: api/Discovery
        public IEnumerable<Discovery> Get()
        {
            return _discoveryRepo.All;
        }

        [Route("/api/discovery/generate")]
        public IEnumerable<Discovery> PostGenerateDiscoveries([FromBody]DiscoveryGenerateDto dto)
        {
            var user = new AuthService().GetUserFromToken(ControllerUtilities.GetAuthToken(Request));
            return new DiscoveryService().GenerateDiscoveries(dto.Point, dto.ItemId, user);
        }

        // GET: api/Discovery/5
        public Discovery Get(Guid id)
        {
            return _discoveryRepo.Find(id);
        }

        // POST: api/Discovery
        public void Post([FromBody]Discovery value)
        {
        }

        // PUT: api/Discovery/5
        public void Put(Guid id, [FromBody]Discovery value)
        {
        }

        // DELETE: api/Discovery/5
        public void Delete(Guid id)
        {
            _discoveryRepo.Delete(id);
        }
    }
}
