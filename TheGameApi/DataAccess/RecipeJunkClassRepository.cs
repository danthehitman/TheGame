using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public class RecipeJunkClassRepository : Repository<RecipeJunkClass>
    {
        public RecipeJunkClassRepository() : base()
        {
            _entities = _context.RecipeJunkClasses;
        }

        public RecipeJunkClassRepository(TheGameContext context) : base(context) 
        {
            _entities = _context.RecipeJunkClasses;
        }
    }
}