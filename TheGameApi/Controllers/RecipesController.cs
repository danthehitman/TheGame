using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using TheGameApi.Controllers.Models;
using TheGameApi.DataAccess;

namespace TheGameApi.Controllers
{
    public class RecipesController : ApiController
    {
        IRecipeRepository _recipeRepo;

        public RecipesController(IRecipeRepository recipeRepo)
        {
            _recipeRepo = recipeRepo;
        }

        // GET: api/Recipes
        public IEnumerable<RecipeDto> Get()
        {
            var recipes = _recipeRepo.All
                .Include(r => r.ItemTypes.Select(i => i.Classes))
                .Include(r => r.JunkTypes.Select(i => i.Classes))
                .Include(r => r.RecipeItemClasses.Select(i => i.ItemClass))
                .Include(r => r.RecipeJunkClasses.Select(j => j.JunkClass))
                .Include(r => r.OutputItem.Classes)
                .ToList();
            return Mapper.Map<IList<RecipeDto>>(recipes);
        }
    }
}
