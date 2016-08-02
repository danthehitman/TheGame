using System.Collections.Generic;

namespace TheGameApi.Controllers.Model
{
    public class ItemTypeDto : ResourceDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int ClassMultiplier { get; set; }
        public ICollection<ItemClassDto> Classes { get; set; }
        public int MaxEffectiveness { get; set; }
        public int MinEffectiveness { get; set; }
        public int MaxUses { get; set; }
        public int MinUses { get; set; }
        public int Rarity { get; set; }
    }
}