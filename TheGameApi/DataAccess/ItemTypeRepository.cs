using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class ItemTypeRepository : Repository<ItemType>
    {
        public ItemTypeRepository()
        {
            _entities = _context.ItemTypes;
        }
    }
}