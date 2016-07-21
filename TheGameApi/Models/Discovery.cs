using System;

namespace TheGameApi.Models
{
    public class Discovery : GeoEntity
    {
        public DateTime Date { get; set; }
        public User Discoverer { get; set; }
        public Guid? DiscovererId { get; set; }
    }
}