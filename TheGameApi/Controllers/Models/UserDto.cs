using System;
using System.Collections.Generic;
using TheGameApi.Models;

namespace TheGameApi.Controllers.Models
{
    public class UserDto : ResourceDto
    {
        public string Name { get; set; }
        public string Email { get; set; }
        public DateTime EnrollDate { get; set; }
        public int Gold { get; set; }
        public IEnumerable<Item> Items { get; set; }
        public IEnumerable<Junk> Junk { get; set; }
    }
}