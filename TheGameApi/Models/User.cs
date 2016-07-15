using System;

namespace TheGameApi.Models
{
    public class User : Entity
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime EnrollDate { get; set; }
        public string Password { get; set; }
        public int Gold { get; set; }
    }
}