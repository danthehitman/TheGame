using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TheGameApi.Core.Services.Model;
using TheGameApi.Models;

namespace TheGameApi.Core.Services
{
    public interface ICraftingService
    {
        Task<Item> CraftItemRecipe(Guid recipeId, List<RecipeIngredient> ingredients);
    }
}
