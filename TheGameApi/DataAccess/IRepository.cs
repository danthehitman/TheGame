using System;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace TheGameApi.DataAccess
{
    public interface IRepository<T> : IDisposable
    {
        IQueryable<T> All { get; }

        IQueryable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties);

        Task<T> FindAsync(Guid id);

        void InsertOrUpdate(T entity, bool forceInsert = false);

        Task DeleteAsync(Guid id);

        Task DeleteAllAsync();

        Task DropSchema(string schemaName);

        Task CreateSchema(string schemaName);

        Task SaveAsync();
    }
}
