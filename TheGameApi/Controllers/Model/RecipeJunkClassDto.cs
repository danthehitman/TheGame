namespace TheGameApi.Controllers.Model
{
    public class RecipeJunkClassDto : ResourceDto
    {
        public int MinimumEffectiveness { get; set; }
        public JunkClassDto JunkClass { get; set; }
    }
}