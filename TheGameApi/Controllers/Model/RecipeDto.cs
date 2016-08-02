using System.Collections.Generic;

namespace TheGameApi.Controllers.Model
{
    public class RecipeDto : ResourceDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<ItemTypeDto> ItemTypes { get; set; }
        public ICollection<JunkTypeDto> JunkTypes { get; set; }
        public ICollection<RecipeItemClassDto> RecipeItemClasses { get; set; }
        public ICollection<RecipeJunkClassDto> RecipeJunkClasses { get; set; }
        public ItemTypeDto OutputItem { get; set; }
    }
}