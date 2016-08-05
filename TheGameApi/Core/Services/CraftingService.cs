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

            var fulFilledItemTypes = new List<Item>();
            var fulFilledItemClasses = new List<Item>();
            var fulFilledJunkTypes = new List<Junk>();
            var fulFilledJunkClasses = new List<Junk>();

            foreach (var ing in ingredients)
            {
                if (ing.Type == IngredientType.Item)
                {
                    var item = await _itemRepo.All.Include(i => i.Type).SingleOrDefaultAsync(i => i.Id.Value == ing.Id);
                    if (item == null)
                        throw new Exception($"Item with ID {ing.Id} not found.");

                    var itemClassMatch = FindMatchedItemClass(item, recipe);

                    if (itemClassMatch != null)
                    {
                        recipe.RecipeItemClasses.Remove(itemClassMatch);
                        fulFilledItemClasses.Add(item);
                        continue;
                    }
                    else
                    {
                        var itemTypeMatch = FindMatchedItemType(item, recipe);
                        if (itemTypeMatch != null)
                        {
                            fulFilledItemTypes.Add(item);
                            recipe.ItemTypes.Remove(itemTypeMatch);
                            continue;
                        }
                        else
                        {
                            foreach (Item i in fulFilledItemClasses)
                            {
                                itemTypeMatch = FindMatchedItemType(i, recipe);
                                itemClassMatch = FindMatchedItemClass(item, recipe);
                                if (itemTypeMatch != null && itemClassMatch != null)
                                {
                                    fulFilledItemClasses.Remove(i);
                                    fulFilledItemTypes.Add(i);
                                    fulFilledItemClasses.Add(item);
                                    continue;
                                }
                            }
                            if (itemTypeMatch != null)
                                continue;
                        }
                        throw new Exception($"Item {item.Name} is not valid for the recipe {recipe.Name}.");
                    }
                }
                else if (ing.Type == IngredientType.Junk)
                {
                    var junk = await _junkRepo.All.Include(i => i.Type).SingleOrDefaultAsync(i => i.Id.Value == ing.Id);
                    if (junk == null)
                        throw new Exception($"Item with ID {ing.Id} not found.");

                    var junkClassMatch = FindMatchedJunkClass(junk, recipe);

                    if (junkClassMatch != null)
                    {
                        recipe.RecipeJunkClasses.Remove(junkClassMatch);
                        fulFilledJunkClasses.Add(junk);
                        continue;
                    }
                    else
                    {
                        var junkTypeMatch = FindMatchedJunkType(junk, recipe);
                        if (junkTypeMatch != null)
                        {
                            fulFilledJunkTypes.Add(junk);
                            recipe.JunkTypes.Remove(junkTypeMatch);
                            continue;
                        }
                        else
                        {
                            foreach(Junk j in fulFilledJunkClasses)
                            {
                                junkTypeMatch = FindMatchedJunkType(j, recipe);
                                junkClassMatch = FindMatchedJunkClass(junk, recipe);
                                if (junkTypeMatch != null && junkClassMatch != null)
                                {
                                    fulFilledJunkClasses.Remove(j);
                                    fulFilledJunkTypes.Add(j);
                                    fulFilledJunkClasses.Add(junk);
                                    continue;
                                }
                            }
                            if (junkTypeMatch != null)
                                continue;
                        }
                        throw new Exception($"Junk {junk.Type.Name} is not valid for the recipe {recipe.Name}.");
                    }
                }
            }
            return null;
        }

        private RecipeItemClass FindMatchedItemClass(Item item, Recipe recipe)
        {
            return recipe.RecipeItemClasses.Where(i => item.Type.Classes.Any(c => c.Id == i.Id) &&
                item.Effectiveness > i.MinimumEffectiveness).OrderByDescending(i => i.MinimumEffectiveness).FirstOrDefault();
            
        }

        private RecipeJunkClass FindMatchedJunkClass(Junk item, Recipe recipe)
        {
            return recipe.RecipeJunkClasses.Where(i => item.Type.Classes.Any(c => c.Id == i.Id) &&
                item.Type.Effectiveness > i.MinimumEffectiveness).OrderByDescending(i => i.MinimumEffectiveness).FirstOrDefault();

        }

        private ItemType FindMatchedItemType(Item item, Recipe recipe)
        {
            return recipe.ItemTypes.FirstOrDefault(i => item.Type.Id == i.Id);
        }

        private JunkType FindMatchedJunkType(Junk junk, Recipe recipe)
        {
            return recipe.JunkTypes.FirstOrDefault(i => i.Id == junk.TypeId);
        }
    }
}