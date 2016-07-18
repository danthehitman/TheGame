using System;
using System.Linq;
using TheGameApi.DataAccess;
using TheGameApi.Models;

namespace TheGameApi.Core.Services
{
    public class AuthService
    {
        private SessionRepository _sessionRepo;

        public AuthService()
        {
            _sessionRepo = new SessionRepository();
        }

        public User GetUserFromToken(Guid token, bool requireActive = true)
        {
            var session = _sessionRepo.All.Where(s => s.Id == token && requireActive ? s.Expires <= DateTime.UtcNow : true).FirstOrDefault();
            if (session != null)
                return session.User;
            return null;
        }
    }
}