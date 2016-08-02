using System;

namespace TheGameApi.Core.Services.Model

{
    public class RecipeIngredient
    {
        public IngredientType Type { get; set; }
        public Guid Id { get; set; }
    }
}
