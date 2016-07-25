using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class ItemTypeRepository : Repository<ItemType>, IItemTypeRepository
    {
        public ItemTypeRepository() : base()
        {
            _entities = _context.ItemTypes;
        }

        public ItemTypeRepository(TheGameContext context) : base(context)
        {
            _entities = _context.ItemTypes;
        }
    }
}