using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Linq.Expressions;
using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    interface IDiscoveryRepository : IDisposable
    {
        IQueryable<Discovery> All { get; }

        IQueryable<Discovery> AllIncluding(params Expression<Func<Discovery, object>>[] includeProperties);

        Discovery Find(int id);

        List<Discovery> Find(DbGeometry geom);

        void InsertOrUpdate(Discovery employee);

        void Delete(int id);

        void Save();
    }
}
