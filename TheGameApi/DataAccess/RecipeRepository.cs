using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class RecipeRepository : Repository<Recipe>
    {
        public RecipeRepository() : base()
        {
            _entities = _context.Recipes;
        }

        public RecipeRepository(TheGameContext context) : base(context)
        {
            _entities = _context.Recipes;
        }
    }
}