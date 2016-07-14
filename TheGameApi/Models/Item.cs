using System;

namespace TheGameApi.Models
{
    public class Item
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ItemType Type { get; set; }
        public Quality Quality { get; set; }
        public User Owner { get; set; }
    }
}