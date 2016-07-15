using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class GeoRepository<T> : Repository<T>, IGeoRepository<T> where T : GeoEntity
    {
        public List<T> Find(DbGeometry geom)
        {
            List<T> entities = _entities.Where(
                e => e.Geometry.Within(geom)).ToList();
            return entities;
        }
    }
}