using System;
using System.Collections.Generic;
using TheGameApi.Core.Services.Model;
using TheGameApi.Models;

namespace TheGameApi.Core.Services
{
    public interface ICraftingService
    {
        Item CraftItemRecipe(Guid recipeId, List<RecipeIngredient> ingredients);
    }
}
