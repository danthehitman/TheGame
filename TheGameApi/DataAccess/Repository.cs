using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public abstract class Repository<T> : IRepository<T> where T : Entity
    {
        public Repository()
        {
            _context = new TheGameContext();
        }

        public Repository(TheGameContext context)
        {
            _context = context;
        }

        protected readonly TheGameContext _context;
        protected DbSet<T> _entities;

        public IQueryable<T> All => _entities;

        public IQueryable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties)
        {
            return includeProperties.Aggregate<Expression<Func<T, object>>, IQueryable<T>>(
                _entities, (current, includeProperty) => current.Include(includeProperty));
        }

        public async Task<T> FindAsync(Guid id)
        {
            return await _entities.FindAsync(id);
        }

        public virtual void InsertOrUpdate(T entity, bool forceInsert = false)
        {
            if (entity.Id == null || forceInsert)
            {
                if (entity.Id == null)
                    entity.Id = Guid.NewGuid();
                _entities.Add(entity);
            }
            else
            {
                _context.Entry(entity).State = EntityState.Modified;
            }
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await _entities.FindAsync(id);
            _entities.Remove(entity);
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        void IDisposable.Dispose()
        {
            _context.Dispose();
        }
    }
}