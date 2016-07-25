using System.ComponentModel.DataAnnotations.Schema;
using TheGameApi.Core.Utilities;

namespace TheGameApi.Models
{
    public class Loot : Entity, ILoot
    {
        [Column("LootType")]
        public string LootType
        {
            get { return LootTypeVal.ToString(); }
            set { LootTypeVal = value.ParseEnum<LootType>(); }
        }

        [NotMapped]
        public LootType LootTypeVal { get; set; }
    }
}