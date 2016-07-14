using System;
using System.Data.Entity.Spatial;

namespace TheGameApi.Models
{
    public class Discovery
    {
        public Guid? Id { get; set; }
        public DbGeometry PointGeometry { get; set; }
        public DateTime Date { get; set; }
        public User Discoverer { get; set; }
    }
}