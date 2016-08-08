define(['ko', 'pubsub', 'utils', 'baseWindowViewModel', 'baseMaker'],
    function (ko, pubsub, utils, baseWindowViewModel, baseMaker) {
        baseMaker.extend(craftingViewModel, baseWindowViewModel);
        function craftingViewModel() {
            var self = this;

            self.modes = {
                recipe: "recipe",
                crafting: "crafting"
            };

            self.allTabs = ko.observableArray(["All"]);

            self.recipes = ko.observableArray();

            self.activeTab = ko.observable("All");

            self.apiService = null;
            self.notificationViewModel = null;
            self.theUser = null;
            self.mode = ko.observable("recipe");

            self.selectedRecipe = ko.observable();

            self.showIngredientSelector = ko.observable(false);
            self.currentRecipeClassForSelecting = ko.observable();
            self.selectedIngredient = ko.observable();

            baseMaker.initClass(self, baseWindowViewModel);

            self.initialize = function (apiServiceArg, theUserArg, notificationViewModelArg) {
                craftingViewModel.prototype.initialize.call(this, "crafting-window");
                self.apiService = apiServiceArg;
                self.notificationViewModel = notificationViewModelArg,
                self.theUser = theUserArg,
                self.loadRecipes();
                self.setupEventSubscriptions();
            };

            self.setupEventSubscriptions = function () {
            };

            self.getRecipesForTab = ko.computed(function () {
                if (self.activeTab() == "All")
                    return self.recipes();
                else {
                    return self.recipes().filter(function (i) {
                        return utils.searchArrayByProp(i.OutputItem.Classes, "Name", self.activeTab()) != null;
                    });
                }
            });

            self.loadRecipes = function () {
                self.apiService.getRecipes(self.loadRecipesSuccessHandler, self.loadRecipesErroHandler);
            };

            self.loadRecipesSuccessHandler = function (data) {
                self.recipes(data);
                for (var i = 0; i < data.length; i++) {
                    var thisRecipe = data[i];
                    for (var ii = 0; ii < thisRecipe.OutputItem.Classes.length; ii++){
                        self.allTabs.push(thisRecipe.OutputItem.Classes[ii].Name);
                    }
                }
            };

            self.loadRecipesErroHandler = function (error) {

            };

            self.craftItem = function () {
                var allIngredients = self.getIngredientsForCurrentRecipe();
                self.apiService.postCraftRecipe(self.selectedRecipe().Id, allIngredients, self.onPostCraftItemSuccessHandler, self.onPostCraftItemErrorHandler);
            };

            self.onPostCraftItemSuccessHandler = function (item) {
                alert(item.Name);
            };

            self.onPostCraftItemErrorHandler = function () {

            };

            self.getIngredientsForCurrentRecipe = function () {
                var list = [];
                if (self.selectedRecipe() != null)
                {
                    var i;
                    for (i = 0; i < self.selectedRecipe().RecipeItemClasses.length; i++) {
                        list.push({ "Type": "Item", "Id": self.selectedRecipe().RecipeItemClasses[i].selectedIngredient().Id });
                    }
                    for (i = 0; i < self.selectedRecipe().RecipeJunkClasses.length; i++) {
                        list.push({ "Type": "Junk", "Id": self.selectedRecipe().RecipeJunkClasses[i].selectedIngredient().Id });
                    }
                }
                return list;
            };

            self.canCraftRecipe = function (recipe) {
                var canCraft = true;
                var i;
                for (i = 0; i < recipe.RecipeItemClasses.length; i++) {
                    var recipeItemClass = recipe.RecipeItemClasses[i];
                    recipeItemClass["userCanFulfill"] = ko.observable(true);
                    if (!self.theUser.hasItemOfClassAndEffectiveness(recipeItemClass.ItemClass.Id, recipeItemClass.MinimumEffectiveness)) {
                        recipeItemClass["userCanFulfill"](false);
                        canCraft = false;
                    }
                    recipeItemClass.selectedIngredient = ko.observable();
                }
                for (i = 0; i < recipe.RecipeJunkClasses.length; i++) {
                    var recipeJunkClass = recipe.RecipeJunkClasses[i];
                    recipeJunkClass["userCanFulfill"] = ko.observable(true);
                    if (!self.theUser.hasJunkOfClassAndEffectiveness(recipeJunkClass.JunkClass.Id, recipeJunkClass.MinimumEffectiveness)){
                        recipeJunkClass["userCanFulfill"](false);
                        canCraft = false;
                    }
                    recipeJunkClass.selectedIngredient = ko.observable();
                }
                return canCraft;
            };

            self.loadForCrafting = function (recipe) {
                self.selectedRecipe(recipe);
                self.mode(self.modes.crafting);

            };

            self.selectIngredient = function (recipeClass) {
                self.currentRecipeClassForSelecting(recipeClass);
                self.showIngredientSelector(true);
            };

            self.getIngredientForSelectedClass = ko.computed(function () {
                if (self.currentRecipeClassForSelecting() != null) {
                    if (self.currentRecipeClassForSelecting().JunkClass)
                        return self.theUser.getJunkByClassId(self.currentRecipeClassForSelecting().JunkClass.Id);
                    else if (self.currentRecipeClassForSelecting().ItemClass)
                        return self.theUser.getItemByClassId(self.currentRecipeClassForSelecting().ItemClass.Id);
                }
                else
                    return [];
            });

            self.chooseIngredient = function () {
                self.currentRecipeClassForSelecting().selectedIngredient(self.selectedIngredient());
                self.showIngredientSelector(false);
            };

            self.getSelectBoxTextForChooseIngredientItem = function (item) {
                if (item.LootType == "Junk")
                    return item.Type.Name + ' ' + item.Quality + ' ' + item.Type.Effectiveness;
                else if (item.LootType == "Item")
                    return item.Name + ' ' + item.Effectiveness;
            };

            self.isRecipeReadyToCraft = ko.computed(function () {
                if (self.selectedRecipe() == null)
                    return false;
                for (i = 0; i < self.selectedRecipe().RecipeJunkClasses.length; i++) {
                    if (self.selectedRecipe().RecipeJunkClasses[i].selectedIngredient() == null) {
                        return false;
                    }
                }

                for (i = 0; i < self.selectedRecipe().RecipeItemClasses.length; i++) {
                    if (self.selectedRecipe().RecipeItemClasses[i].selectedIngredient() == null) {
                        return false;
                    }
                }
                return true;
            });

            return self;
        };

        return craftingViewModel;
    });