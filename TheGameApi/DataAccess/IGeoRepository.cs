using System.Collections.Generic;
using System.Data.Entity.Spatial;

namespace TheGameApi.DataAccess
{
    interface IGeoRepository<T>
    {
        List<T> Find(DbGeometry geom);
    }
}
