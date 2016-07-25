using System;
using System.ComponentModel.DataAnnotations.Schema;
using TheGameApi.Core.Utilities;

namespace TheGameApi.Models
{
    public class Junk : Loot
    {
        public Junk()
        {
            LootTypeVal = Models.LootType.Junk;
        }

        public JunkType Type { get; set; }
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
    }
}