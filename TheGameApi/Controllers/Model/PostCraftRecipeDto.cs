using System;
using System.Collections.Generic;
using TheGameApi.Core.Services.Model;

namespace TheGameApi.Controllers.Model
{
    public class PostCraftRecipeDto
    {
        public Guid RecipeId { get; set; }
        public IEnumerable<RecipeIngredient> Ingredients { get; set; }
    }
}