using System.Collections.Generic;

namespace TheGameApi.Models
{
    public class ItemClass : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<ItemType> ItemTypes { get; set; }
        public ICollection<Recipe> Recipes { get; set; }
    }
}