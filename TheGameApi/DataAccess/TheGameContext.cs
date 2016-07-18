using System.Data.Entity;
using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class TheGameContext : DbContext
    {
        public TheGameContext()
            : base("TheGame")
        {

        }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Recipe>()
            .HasMany(t => t.JunkTypes)
            .WithMany(t => t.Recipes);

            modelBuilder.Entity<Recipe>()
            .HasMany(t => t.ItemTypes)
            .WithMany(t => t.Recipes);

            modelBuilder.Entity<Recipe>()
           .HasMany(t => t.RecipeJunkClasses)
           .WithMany(t => t.Recipes);

            modelBuilder.Entity<Recipe>()
            .HasMany(t => t.RecipeItemClasses)
            .WithMany(t => t.Recipes);

            modelBuilder.Entity<ItemType>()
            .HasMany(t => t.Classes)
            .WithMany(t => t.ItemTypes);

            modelBuilder.Entity<JunkType>()
            .HasMany(t => t.Classes)
            .WithMany(t => t.JunkTypes);

            base.OnModelCreating(modelBuilder);
        }

        public DbSet<Encounter> Encounters { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Discovery> Discoveries { get; set; }
        public DbSet<Item> Items { get; set; }
        public DbSet<ItemType> ItemTypes { get; set; }
        public DbSet<ItemClass> ItemClasses { get; set; }
        public DbSet<Junk> Junk { get; set; }
        public DbSet<JunkType> JunkTypes { get; set; }
        public DbSet<JunkClass> JunkClasses { get; set; }
        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<RecipeJunkClass> RecipeJunkClasses { get; set; }
        public DbSet<RecipeItemClass> RecipeItemClasses { get; set; }
    }

}