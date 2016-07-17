using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class JunkRepository : Repository<Junk>
    {
        public JunkRepository() : base()
        {
            _entities = _context.Junk;
        }

        public JunkRepository(TheGameContext context) : base(context)
        {
            _entities = _context.Junk;
        }
    }
}