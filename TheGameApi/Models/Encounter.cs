﻿using System;
using System.Data.Entity.Spatial;

namespace TheGameApi.Models
{
    public class Encounter
    {
        public Guid? Id { get; set; }
        public DbGeometry PointGeometry { get; set; }
        public string Name { get; set; }
    }
}