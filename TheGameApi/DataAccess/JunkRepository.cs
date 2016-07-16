using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class JunkRepository : Repository<Junk>
    {
        public JunkRepository()
        {
            _entities = _context.Junk;
        }
    }
}