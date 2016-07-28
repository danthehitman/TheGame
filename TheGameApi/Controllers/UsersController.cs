using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using TheGameApi.Controllers.Models;
using TheGameApi.DataAccess;

namespace TheGameApi.Controllers
{
    public class UsersController : ApiController
    {
        private IUserRepository _userRepo;
        private IItemRepository _itemRepo;
        private IJunkRepository _junkRepo;

        public UsersController(IUserRepository userRepo, IItemRepository itemRepo, IJunkRepository junkRepo)
        {
            _userRepo = userRepo;
            _itemRepo = itemRepo;
            _junkRepo = junkRepo;
        }
        // GET: api/Users/5
        public async Task<UserDto> GetAsync(Guid id)
        {
            var user = await _userRepo.FindAsync(id);
            return Mapper.Map<UserDto>(user);
        }

        [Route("api/users/{userId}/items")]
        public async Task<IEnumerable<ItemDto>> GetItemsForUserAsync(Guid userId)
        {
            var items = await _itemRepo.All.Include(j => j.Type.Classes).Where(i => i.OwnerId.Value == userId).ToListAsync();
            return Mapper.Map<List<ItemDto>>(items);
        }

        [Route("api/users/{userId}/junk")]
        public async Task<IEnumerable<JunkDto>> GetJunkForUserAsync(Guid userId)
        {
            var junk = await _junkRepo.All.Include(j => j.Type.Classes).Where(j => j.OwnerId.Value == userId).ToListAsync();
            return Mapper.Map<List<JunkDto>>(junk);
        }
    }
}
