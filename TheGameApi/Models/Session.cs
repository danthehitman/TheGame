using System;

namespace TheGameApi.Models
{
    public class Session : Entity
    {
        public User User { get; set; }
        public DateTime Expires { get; set; }
    }
}