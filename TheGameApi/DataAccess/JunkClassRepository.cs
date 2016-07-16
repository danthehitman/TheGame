using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class JunkClassRepository : Repository<JunkClass>
    {
        public JunkClassRepository() : base()
        {
            _entities = _context.JunkClasses;
        }

        public JunkClassRepository(TheGameContext context) : base(context) 
        {
            _entities = _context.JunkClasses;
        }
    }
}