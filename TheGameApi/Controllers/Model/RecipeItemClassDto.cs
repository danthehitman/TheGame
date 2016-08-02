namespace TheGameApi.Controllers.Model
{
    public class RecipeItemClassDto : ResourceDto
    {
        public int MinimumEffectiveness { get; set; }
        public ItemClassDto ItemClass { get; set; }
    }
}