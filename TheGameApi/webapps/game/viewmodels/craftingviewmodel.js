define(['ko', 'pubsub', 'utils', 'baseWindowViewModel', 'baseMaker'],
    function (ko, pubsub, utils, baseWindowViewModel, baseMaker) {
        baseMaker.extend(craftingViewModel, baseWindowViewModel);
        function craftingViewModel() {
            var self = this;

            self.allTabs = ko.observableArray(["All"]);

            self.recipes = ko.observableArray();

            self.activeTab = ko.observable("All");

            self.apiService = null;
            self.notificationViewModel = null;
            self.theUser = null;
            self.mode = ko.observable("recipe");

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

            self.canCraftRecipe = function (recipe) {
                var canCraft = true;
                var i;
                for (i = 0; i < recipe.RecipeItemClasses.length; i++) {
                    var recipeItemClass = recipe.RecipeItemClasses[i];
                    if (!self.theUser.hasItemOfClassAndEffectiveness(recipeItemClass.ItemClass.Id, recipeItemClass.MinimumEffectiveness)) {
                        recipeItemClass["userCanFulfill"] = false;
                        canCraft = false;
                    }
                    recipeItemClass["userCanFulfill"] = true;
                }
                for (i = 0; i < recipe.RecipeJunkClasses.length; i++) {
                    var recipeJunkClass = recipe.RecipeJunkClasses[i];
                    if (!self.theUser.hasJunkOfClassAndEffectiveness(recipeJunkClass.JunkClass.Id, recipeJunkClass.MinimumEffectiveness)){
                        recipeJunkClass["userCanFulfill"] = false;
                        canCraft = false;
                    }
                    recipeJunkClass["userCanFulfill"] = true;
                }
                return canCraft;
            };

            self.loadRecipesErroHandler = function (error) {

            };

            return self;
        };

        return craftingViewModel;
    });