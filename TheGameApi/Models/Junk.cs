namespace TheGameApi.Models
{
    public class Junk : Entity
    {
        public JunkType Type { get; set; }
        public Quality Quality { get; set; }
        public User Owner { get; set; }
    }
}