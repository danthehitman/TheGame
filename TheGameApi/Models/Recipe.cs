using System;
using System.Collections.Generic;

namespace TheGameApi.Models
{
    public class Recipe
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<ItemType> ItemTypes { get; set; }
        public ICollection<JunkType> JunkTypes { get; set; }
        public ICollection<ItemClass> ItemClasses { get; set; }
        public ICollection<JunkClass> JunkClasses { get; set; }
        public ItemType Output { get; set; }
    }
}