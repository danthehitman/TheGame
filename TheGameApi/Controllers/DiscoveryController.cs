using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using TheGameApi.Controllers.Models;
using TheGameApi.Core.Services;
using TheGameApi.DataAccess;
using TheGameApi.Models;

namespace TheGameApi.Controllers
{
    //[RoutePrefix("/rest/discovery")]
    public class DiscoveryController : ApiController
    {
        private IDiscoveryRepository _discoveryRepo;
        private IDiscoveryService _discoveryService;

        public DiscoveryController(IDiscoveryRepository discoveryRepo, IDiscoveryService discoveryService)
        {
            _discoveryRepo = discoveryRepo;
            _discoveryService = discoveryService;
        }

        // GET: api/Discovery
        public IEnumerable<Discovery> Get()
        {
            return _discoveryRepo.All;
        }

        [Route("api/discovery/generate")]
        public async Task<IEnumerable<Discovery>> PostGenerateDiscoveriesAsync([FromBody]DiscoveryGenerateDto dto)
        {
            try
            {
                var user = new AuthService().GetUserFromToken(ControllerUtilities.GetAuthToken(Request));
                return await _discoveryService.GenerateDiscoveriesAsync(dto.Point, dto.ItemId, user);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }

        [Route("api/discovery/{id}/convert")]
        public async Task<ILoot> PostConvertDiscoveryAsync(Guid id)
        {
            try
            {
                var user = new AuthService().GetUserFromToken(ControllerUtilities.GetAuthToken(Request));
                var loot = await _discoveryService.ConvertToLoot(id, user);
                Type destType = typeof(object);
                if (loot as Item != null)
                    destType = typeof(ItemDto);
                else if (loot as Junk != null)
                    destType = typeof(JunkDto);
                else if (loot as GoldLoot != null)
                    destType = typeof(GoldLoot);
                return (ILoot)Mapper.Map(loot, loot.GetType(), destType);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw ex;
            }
        }

        // GET: api/Discovery/5
        public async Task<Discovery> GetAsync(Guid id)
        {
            return await _discoveryRepo.FindAsync(id);
        }

        // DELETE: api/Discovery/5
        public async Task DeleteAsync(Guid id)
        {
            await _discoveryRepo.DeleteAsync(id);
        }
    }
}
