using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class GeoRepository<T> : Repository<T>, IGeoRepository<T> where T : GeoEntity
    {
        public GeoRepository() : base()
        {
        }

        public GeoRepository(TheGameContext context) : base(context)
        {
        }

        public List<T> Find(DbGeometry geom)
        {
            List<T> entities = _entities.Where(
                e => e.Geometry.Within(geom)).ToList();
            return entities;
        }
    }
}