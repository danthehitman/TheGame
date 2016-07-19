using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Threading.Tasks;

namespace TheGameApi.DataAccess
{
    public interface IGeoRepository<T> : IRepository<T>
    {
        List<T> Find(DbGeometry geom);
    }
}
