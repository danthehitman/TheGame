using System;
using TheGameApi.Models;

namespace TheGameApi.Controllers.Models
{
    public class JunkDto : ResourceDto, ILoot
    {
        public JunkTypeDto Type { get; set; }
        public Guid TypeId { get; set; }
        public string Quality { get; set; }
        public User Owner { get; set; }
        public Guid? OwnerId { get; set; }
        public string LootType { get; set; }
    }
}