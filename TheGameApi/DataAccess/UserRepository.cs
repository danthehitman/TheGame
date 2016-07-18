using System;
using TheGameApi.Core.Utilities;
using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class UserRepository : Repository<User>
    {
        public UserRepository() : base()
        {
            _entities = _context.Users;
        }

        public UserRepository(TheGameContext context) : base(context)
        {
            _entities = _context.Users;
        }

        public override void InsertOrUpdate(User entity)
        {
            if (entity.Password != null)
            {
                entity.Password = PasswordStorage.CreateHash(entity.Password);
            }
            if (entity.EnrollDate == DateTime.MinValue)
            {
                entity.EnrollDate = DateTime.Now;
            }
            base.InsertOrUpdate(entity);
        }
    }
}