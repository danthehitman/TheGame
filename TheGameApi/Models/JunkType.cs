using System.Collections.Generic;

namespace TheGameApi.Models
{
    public class JunkType : Entity, IIngredient
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int Effectiveness { get; set; }
        public ICollection<Recipe> Recipes { get; set; }
        public ICollection<JunkClass> Classes { get; set; }
        public int Rarity { get; set; }
    }
}