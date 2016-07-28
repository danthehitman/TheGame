namespace TheGameApi.Controllers.Models
{
    public class RecipeJunkClassDto : ResourceDto
    {
        public int MinimumEffectiveness { get; set; }
        public JunkClassDto JunkClass { get; set; }
    }
}