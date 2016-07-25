using System;
using System.ComponentModel.DataAnnotations.Schema;
using TheGameApi.Core.Utilities;

namespace TheGameApi.Models
{
    public class Item : Loot
    {
        public Item()
        {
            LootTypeVal = Models.LootType.Item;
        }

        public string Name { get; set; }
        public string Description { get; set; }
        public ItemType Type { get; set; }
        public Guid TypeId { get; set; }
        [NotMapped]
        public Quality Quality { get; set; }
        [Column("Quality")]
        public string QualityString
        {
            get { return Quality.ToString(); }
            set { Quality = value.ParseEnum<Quality>(); }
        }
        public User Owner { get; set; }
        public Guid? OwnerId { get; set; }
        public int Effectiveness { get; set; }
        public int Uses { get; set; }
    }
}