using System.Collections.Generic;

namespace TheGameApi.Models
{
    public class RecipeItemClass : Entity
    {
        public int MinimumEffectiveness { get; set; }
        public ItemClass ItemClass { get; set; }
        public List<Recipe> Recipes { get; set; }
    }
}