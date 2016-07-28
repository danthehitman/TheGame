using System;
using TheGameApi.Models;

namespace TheGameApi.Controllers.Models
{
    public class ItemDto : ResourceDto, ILoot
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public ItemTypeDto Type { get; set; }
        public Guid TypeId { get; set; }
        public string Quality { get; set; }
        public User Owner { get; set; }
        public Guid? OwnerId { get; set; }
        public int Effectiveness { get; set; }
        public int Uses { get; set; }
        public string LootType { get; set; }
    }
}