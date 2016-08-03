using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using AutoMapper;
using TheGameApi.Controllers.Model;
using TheGameApi.Core.Services;
using TheGameApi.DataAccess;

namespace TheGameApi.Controllers
{
    public class RecipesController : ApiController
    {
        IRecipeRepository _recipeRepo;
        ICraftingService _craftingService;

        public RecipesController(IRecipeRepository recipeRepo, ICraftingService craftingService)
        {
            _recipeRepo = recipeRepo;
            _craftingService = craftingService;
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

        public ItemDto PostCraftRecipe(PostCraftRecipeDto dto)
        {

            return null;
        }
    }
}
