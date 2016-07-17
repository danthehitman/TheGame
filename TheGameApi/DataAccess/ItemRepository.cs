using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class ItemRepository : Repository<Item>
    {
        public ItemRepository() : base()
        {
            _entities = _context.Items;
        }

        public ItemRepository(TheGameContext context) : base(context)
        {
            _entities = _context.Items;
        }
    }
}