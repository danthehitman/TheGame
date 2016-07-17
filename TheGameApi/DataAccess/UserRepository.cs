using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
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
            base.InsertOrUpdate(entity);
        }
    }
}