using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Linq.Expressions;
using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class DiscoveryRepository : IDiscoveryRepository
    {
        readonly TheGameContext _context = new TheGameContext();

        public IQueryable<Discovery> All
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public IQueryable<Discovery> AllIncluding(params Expression<Func<Discovery, object>>[] includeProperties)
        {
            throw new NotImplementedException();
        }

        public void Delete(int id)
        {
            throw new NotImplementedException();
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public List<Discovery> Find(DbGeometry geom)
        {
            throw new NotImplementedException();
        }

        public Discovery Find(int id)
        {
            throw new NotImplementedException();
        }

        public void InsertOrUpdate(Discovery employee)
        {
            throw new NotImplementedException();
        }

        public void Save()
        {
            throw new NotImplementedException();
        }
    }
}