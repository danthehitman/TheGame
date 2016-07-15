using System.Collections.Generic;

namespace TheGameApi.Models
{
    public class JunkClass : Entity
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<JunkType> JunkTypes { get; set; }
        public ICollection<Recipe> Recipes { get; set; }
    }
}