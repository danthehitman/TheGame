using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class RecipeRepository : Repository<Recipe>
    {
        public RecipeRepository()
        {
            _entities = _context.Recipes;
        }
    }
}