namespace TheGameApi.Models
{
    public class GoldLoot: ILoot
    {
        public int Ammount { get; set; }

        public string LootType { get { return Models.LootType.Gold.ToString(); } }
    }
}