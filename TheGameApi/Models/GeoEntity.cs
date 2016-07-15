using System.Data.Entity.Spatial;

namespace TheGameApi.Models
{
    public class GeoEntity : Entity
    {
        public DbGeometry Geometry { get; set; }
    }
}