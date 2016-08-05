using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
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
        private IRecipeRepository _recipeRepo;

        public CraftingService(IItemRepository itemRepo, IJunkRepository junkRepo,
            IJunkTypeRepository junkTypeRepo, IItemTypeRepository itemTypeRepo, IRecipeRepository recipeRepo)
        {
            _itemRepo = itemRepo;
            _junkRepo = junkRepo;
            _itemTypeRepo = itemTypeRepo;
            _junkTypeRepo = junkTypeRepo;
            _recipeRepo = recipeRepo;
        }

        public async Task<Item> CraftItemRecipe(Guid recipeId, List<RecipeIngredient> ingredients)
        {
            var recipe = await _recipeRepo.All.Include(r => r.ItemTypes).Include(r => r.JunkTypes).SingleOrDefaultAsync(r => r.Id == recipeId);
            if (recipe == null)
                throw new Exception("Recipe not found.");

            var items = new List<Item>();
            var junks = new List<Junk>();



            foreach (var ing in ingredients)
            {
                if (ing.Type == IngredientType.Item)
                {
                    var item = await _itemRepo.All.Include(i => i.Type).SingleOrDefaultAsync(i => i.Id.Value == ing.Id);
                    if (item == null)
                        throw new Exception($"Item with ID {ing.Id} not found.");

                    var itemMatch =
                        recipe.ItemTypes.Where(i => i.Id == item.TypeId && item.Effectiveness > i.MinEffectiveness
                                                    && item.Effectiveness < i.MaxEffectiveness).OrderBy(i => i.MinEffectiveness).FirstOrDefault();

                    if (itemMatch == null)
                        throw new Exception($"Item {item.Name} with effectiveness {item.Effectiveness} " +
                                            $"does not meet either the effectiveness requirements or the  type requirements for the recipe.");

                    recipe.ItemTypes.Remove(itemMatch);
                }
                else if (ing.Type == IngredientType.Junk)
                {
                    var junk = await _junkRepo.All.Include(i => i.Type).SingleOrDefaultAsync(i => i.Id.Value == ing.Id);
                    if (junk == null)
                        throw new Exception($"Item with ID {ing.Id} not found.");

                    var junkMatch =
                        recipe.JunkTypes.FirstOrDefault(i => i.Id == junk.TypeId);

                    if (junkMatch == null)
                        throw new Exception($"Junk {junk.Type.Name} does not meet either the type requirements for the recipe.");

                    recipe.JunkTypes.Remove(junkMatch);
                }
            }

            return null;
        }
    }
}