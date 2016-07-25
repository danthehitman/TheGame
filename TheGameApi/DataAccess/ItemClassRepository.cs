using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class ItemClassRepository : Repository<ItemClass>, IItemClassRepository
    {
        public ItemClassRepository() : base()
        {
            _entities = _context.ItemClasses;
        }

        public ItemClassRepository(TheGameContext context) : base(context)
        {
            _entities = _context.ItemClasses;
        }
    }
}