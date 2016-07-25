using System;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using TheGameApi.DataAccess;
using TheGameApi.Models;

namespace TheGameApi.Controllers
{
    public class SessionsController : ApiController
    {
        private ISessionRepository _sessionRepo;

        public SessionsController(ISessionRepository sessionRepo)
        {
            _sessionRepo = sessionRepo;
        }

        // GET: api/Sessions/5
        public async Task<Session> GetAsync(Guid id)
        {
            return await _sessionRepo.FindAsync(id);
        }

        [Route("api/sessions/{id}/user")]
        public User GetUserForSession(Guid id)
        {
            return _sessionRepo.All.Include(s => s.User).Where(s => s.Id == id).FirstOrDefault()?.User;
        }
    }
}
