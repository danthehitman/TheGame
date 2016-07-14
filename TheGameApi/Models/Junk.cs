using System;

namespace TheGameApi.Models
{
    public class Junk
    {
        public Guid? Id { get; set; }
        public JunkType Type { get; set; }
        public Quality Quality { get; set; }
        public User Owner { get; set; }
    }
}