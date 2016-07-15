﻿using System;
using System.Data.Entity;
using System.Linq;
using System.Linq.Expressions;
using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class Repository<T> : IRepository<T> where T : Entity
    {
        protected readonly TheGameContext _context = new TheGameContext();
        protected DbSet<T> _entities;

        public IQueryable<T> All => _entities;

        public IQueryable<T> AllIncluding(params Expression<Func<T, object>>[] includeProperties)
        {
            return includeProperties.Aggregate<Expression<Func<T, object>>, IQueryable<T>>(
                _entities, (current, includeProperty) => current.Include(includeProperty));
        }

        public T Find(int id)
        {
            return _entities.Find(id);
        }

        public void InsertOrUpdate(T entity)
        {
            if (entity.Id == null)
            {
                entity.Id = Guid.NewGuid();
                _entities.Add(entity);
            }
            else
            {
                _context.Entry(entity).State = EntityState.Modified;
            }
        }

        public void Delete(int id)
        {
            var entity = _context.Items.Find(id);
            _context.Items.Remove(entity);
        }

        public void Save()
        {
            _context.SaveChanges();
        }

        void IDisposable.Dispose()
        {
            _context.Dispose();
        }
    }
}