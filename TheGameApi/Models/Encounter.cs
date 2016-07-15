using System;

namespace TheGameApi.Models
{
    public class Encounter : GeoEntity
    {
        public string Name { get; set; }
        public DateTime Date { get; set; }
    }
}