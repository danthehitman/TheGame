using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class SessionRepository : Repository<Session>, ISessionRepository
    {
        public SessionRepository() : base()
        {
            _entities = _context.Sessions;
        }

        public SessionRepository(TheGameContext context) : base(context)
        {
            _entities = _context.Sessions;
        }
    }
}