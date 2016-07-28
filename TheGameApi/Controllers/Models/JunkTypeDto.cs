using System.Collections.Generic;

namespace TheGameApi.Controllers.Models
{
    public class JunkTypeDto : ResourceDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int Effectiveness { get; set; }
        public ICollection<JunkClassDto> Classes { get; set; }
        public int Rarity { get; set; }
    }
}