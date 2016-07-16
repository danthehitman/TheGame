using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class ItemClassRepository : Repository<ItemClass>
    {
        public ItemClassRepository()
        {
            _entities = _context.ItemClasses;
        }
    }
}