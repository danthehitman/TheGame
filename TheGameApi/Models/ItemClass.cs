using System;
using System.Collections.Generic;

namespace TheGameApi.Models
{
    public class ItemClass
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<ItemType> ItemTypes { get; set; }
        public ICollection<Recipe> Recipes { get; set; }
    }
}