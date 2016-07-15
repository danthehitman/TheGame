using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class ItemRepository : Repository<Item>
    {
        public ItemRepository()
        {
            _entities = _context.Items;
        }
    }
}