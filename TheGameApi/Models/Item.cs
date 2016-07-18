namespace TheGameApi.Models
{
    public class Item : Entity
    {       
        public string Name { get; set; }
        public string Description { get; set; }
        public ItemType Type { get; set; }
        public Quality Quality { get; set; }
        public User Owner { get; set; }
        public int Effectiveness { get; set; }
        public int Uses { get; set; }
    }
} 