using System;
using System.Collections.Generic;
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
        // GET: api/Sessions
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET: api/Sessions/5
        public async Task<Session> GetAsync(Guid id)
        {
            return await _sessionRepo.FindAsync(id);
        }

        // POST: api/Sessions
        public void Post([FromBody]string value)
        {
        }

        // PUT: api/Sessions/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Sessions/5
        public void Delete(int id)
        {
        }
    }
}
