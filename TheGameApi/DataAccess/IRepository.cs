using System;
using System.Linq;
using System.Linq.Expressions;

namespace TheGameApi.DataAccess
{
    interface IRepository<T> : IDisposable
    {
        IQueryable<T> All { get; }

        IQueryable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties);

        T Find(int id);

        void InsertOrUpdate(T entity);

        void Delete(int id);

        void Save();
    }
}
