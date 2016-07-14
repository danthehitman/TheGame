using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Linq.Expressions;
using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class EncounterRepository : IEncountersRepository
    {
        readonly TheGameContext _context = new TheGameContext();

        public IQueryable<Encounter> All => _context.Encounters;

        public IQueryable<Encounter> AllIncluding(params Expression<Func<Encounter, object>>[] includeProperties)
        {
            return includeProperties.Aggregate<Expression<Func<Encounter, object>>, IQueryable<Encounter>>(
                _context.Encounters, (current, includeProperty) => current.Include(includeProperty));
        }

        public Encounter Find(int id)
        {
            return _context.Encounters.Find(id);
        }

        public List<Encounter> Find(DbGeometry geom)
        {
            List<Encounter> encounters = _context.Encounters.Where(
                e => e.PointGeometry.Within(geom)).ToList();

            return encounters;
        }

        public void InsertOrUpdate(Encounter encounter)
        {
            if (encounter.Id == null)
            {
                encounter.Id = Guid.NewGuid();
                _context.Encounters.Add(encounter);
            }
            else
            {
                _context.Entry(encounter).State = EntityState.Modified;
            }
        }

        public void Delete(int id)
        {
            var encounter = _context.Encounters.Find(id);
            _context.Encounters.Remove(encounter);
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