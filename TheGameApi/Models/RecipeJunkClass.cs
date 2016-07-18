using System.Collections.Generic;

namespace TheGameApi.Models
{
    public class RecipeJunkClass: Entity
    {
        public int MinimumEffectiveness { get; set; }
        public JunkClass JunkClass { get; set; }
        public List<Recipe> Recipes { get; set; }
    }
}