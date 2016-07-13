using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Web;
using DotSpatial.Topology;

namespace TheGameApi.Models
{
    public class Encounter
    {
        public Guid? Id { get; set; }
        public DbGeometry PointGeometry { get; set; }
        public string Name { get; set; }

    }
}