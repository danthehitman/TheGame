using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using TheGameApi.DataAccess;
using TheGameApi.Models;

namespace TheGameApi.Controllers
{
    public class RecipiesController : ApiController
    {
        IRecipeRepository _recipeRepo;

        public RecipiesController(IRecipeRepository recipeRepo)
        {
            _recipeRepo = recipeRepo;
        }

        // GET: api/Recipies
        public IEnumerable<Recipe> Get()
        {
            return _recipeRepo.All.ToList();
        }
    }
}
