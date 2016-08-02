using System;
using System.Collections.Generic;
using TheGameApi.Core.Services.Model;
using TheGameApi.DataAccess;
using TheGameApi.Models;

namespace TheGameApi.Core.Services
{
    public class CraftingService : ICraftingService
    {
        private IItemRepository _itemRepo;
        private IJunkRepository _junkRepo;
        private IItemTypeRepository _itemTypeRepo;
        private IJunkTypeRepository _junkTypeRepo;

        public CraftingService(IItemRepository itemRepo, IJunkRepository junkRepo,
            IJunkTypeRepository junkTypeRepo, IItemTypeRepository itemTypeRepo)
        {
            _itemRepo = itemRepo;
            _junkRepo = junkRepo;
            _itemTypeRepo = itemTypeRepo;
            _junkTypeRepo = junkTypeRepo;
        }

        public Item CraftItemRecipe(Guid recipeId, List<RecipeIngredient> ingredients)
        {
            return null;
        }
    }
}