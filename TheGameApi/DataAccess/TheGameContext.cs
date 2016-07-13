using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;
using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class TheGameContext : DbContext
    {
        public TheGameContext()
            :base("TheGame")
        {
            
        }

        public DbSet<Encounter> Encounters { get; set; }
    }
}