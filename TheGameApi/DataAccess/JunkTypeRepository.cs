using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class JunkTypeRepository : Repository<JunkType>
    {
        public JunkTypeRepository() : base()
        {
            _entities = _context.JunkTypes;
        }

        public JunkTypeRepository(TheGameContext context) : base(context)
        {
            _entities = _context.JunkTypes;
        }
    }
}