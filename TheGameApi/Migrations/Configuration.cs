using System.Threading.Tasks;

namespace TheGameApi.Migrations
{
    using System;
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;
    using DataAccess;
    using Models;

    internal sealed class Configuration : DbMigrationsConfiguration<TheGameApi.DataAccess.TheGameContext>
    {
        private JunkClassRepository _junkClassRepo;
        private JunkTypeRepository _junkTypeRepo;
        private ItemClassRepository _itemClasseRepo;
        private ItemTypeRepository _itemTypeRepo;
        private UserRepository _userRepo;
        private RecipeRepository _recipeRepo;
        private SessionRepository _sessionRepo;
        private ItemRepository _itemRepository;

        public Configuration()
        {
            AutomaticMigrationsEnabled = true;
            AutomaticMigrationDataLossAllowed = true;
            ContextKey = "TheGameApi.DataAccess.TheGameContext";
        }

        protected override void Seed(TheGameApi.DataAccess.TheGameContext context)
        {
            _junkClassRepo = new JunkClassRepository(context);
            _junkTypeRepo = new JunkTypeRepository(context);
            _itemClasseRepo = new ItemClassRepository(context);
            _itemTypeRepo = new ItemTypeRepository(context);
            _userRepo = new UserRepository(context);
            _recipeRepo = new RecipeRepository(context);
            _sessionRepo = new SessionRepository(context);
            _itemRepository = new ItemRepository(context);
            SeedStuffAsync().Wait();
        }

        private async Task SeedStuffAsync()
        {
            //Users
            var UserDan = new User() { Email = "danthehitman@gmail.com", Password = "test", Name =  "ARKDJ" };
            _userRepo.InsertOrUpdate(UserDan);
            await _userRepo.SaveAsync();

            var sesionGuid = Guid.Parse("7EA9B445-F160-4F58-82E6-B87A333EF344");
            await _sessionRepo.DeleteAsync(sesionGuid);
            var SessionDan = new Session() { User = UserDan, Expires = DateTime.UtcNow.AddDays(2), Id = sesionGuid };
            _sessionRepo.InsertOrUpdate(SessionDan, true);
            await _sessionRepo.SaveAsync();

            //Junk Classes===============================================================================================================
            var StickyStuff = new JunkClass() { Description = "Things for binding objects together.", Name = "Sticky Stuff" };
            _junkClassRepo.InsertOrUpdate(StickyStuff);
            var StructuralStuff = new JunkClass() { Description = "Things for giving structure and form to objects.", Name = "Structural Stuff" };
            _junkClassRepo.InsertOrUpdate(StructuralStuff);
            var PowerStuff = new JunkClass() { Description = "Stuff to provide power.", Name = "Power Stuff" };
            _junkClassRepo.InsertOrUpdate(PowerStuff);
            var TalkyStuff = new JunkClass() { Description = "Stuff to communicate with.", Name = "Talky Stuff" };
            _junkClassRepo.InsertOrUpdate(TalkyStuff);
            var ReflectiveStuff = new JunkClass() { Description = "Stuff that reflects light.", Name = "Reflective Stuff" };
            _junkClassRepo.InsertOrUpdate(ReflectiveStuff);
            var ConductiveStuff = new JunkClass() { Description = "Stuff that conducts all types of electricity and signals", Name = "Conductive Stuff" };
            _junkClassRepo.InsertOrUpdate(ConductiveStuff);
            var ButtonStuff = new JunkClass() { Description = "Stuff that can be used as a button.", Name = "Button Stuff" };
            _junkClassRepo.InsertOrUpdate(ButtonStuff);
            var SwitchStuff = new JunkClass() { Description = "Stuff that can be used as a switch.", Name = "Switch Stuff" };
            _junkClassRepo.InsertOrUpdate(SwitchStuff);
            var ComputerStuff = new JunkClass() { Description = "Stuff that can be used for processing and control.", Name = "Computer Stuff" };
            _junkClassRepo.InsertOrUpdate(ComputerStuff);
            var GeoStuff = new JunkClass() { Description = "Stuff that can be used to determine and track location.", Name = "Geo Stuff" };
            _junkClassRepo.InsertOrUpdate(GeoStuff);
            await _junkClassRepo.SaveAsync();

            //Junk Types=================================================================================================================
            //StickStuff
            var DuckTape = new JunkType() { Name = "Duck Tape", Description = "The stickiest, strongest, most amazing tape.", Effectiveness = 10, Classes = new List<JunkClass>() { StickyStuff } };
            _junkTypeRepo.InsertOrUpdate(DuckTape);
            var MagicTape = new JunkType() { Name = "Magic Tape", Description = "It's magic cause its invisible.  Get it?  Not very strong though.", Effectiveness = 2, Classes = new List<JunkClass>() { StickyStuff } };
            _junkTypeRepo.InsertOrUpdate(MagicTape);
            var MaskingTape = new JunkType() { Name = "Masking Tape", Description = "Makes a clean edge.  Fun colors.  Not terribly strong.", Effectiveness = 4, Classes = new List<JunkClass>() { StickyStuff } };
            //StructuralStuff
            _junkTypeRepo.InsertOrUpdate(MaskingTape);
            var PaperTowelRoll = new JunkType() { Name = "Paper Towel Roll", Description = "What cant you make with a paper towel roll?", Effectiveness = 4, Classes = new List<JunkClass>() { StructuralStuff } };
            _junkTypeRepo.InsertOrUpdate(PaperTowelRoll);
            var CardboardBox = new JunkType() { Name = "Carboard Box", Description = "What cant you make with a carbaord box?", Effectiveness = 5, Classes = new List<JunkClass>() { StructuralStuff } };
            _junkTypeRepo.InsertOrUpdate(CardboardBox);
            var WoodBox = new JunkType() { Name = "Wood Box", Description = "A box made of wood.", Effectiveness = 8, Classes = new List<JunkClass>() { StructuralStuff } };
            _junkTypeRepo.InsertOrUpdate(WoodBox);
            var MetalBox = new JunkType() { Name = "Metal Box", Description = "A box made of metal.", Effectiveness = 10, Classes = new List<JunkClass>() { StructuralStuff } };
            _junkTypeRepo.InsertOrUpdate(MetalBox);
            //PowerStuff
            var HandGenerator = new JunkType() { Name = "Hand Generator", Description = "Used in trade show flashlights.", Effectiveness = 1, Classes = new List<JunkClass>() { PowerStuff } };
            _junkTypeRepo.InsertOrUpdate(HandGenerator);
            var NineVBattery = new JunkType() { Name = "9V Battery", Description = "Stick it on your tongue to test.", Effectiveness = 5, Classes = new List<JunkClass>() { PowerStuff } };
            _junkTypeRepo.InsertOrUpdate(NineVBattery);
            var AABattery = new JunkType() { Name = "AA Battery", Description = "Used in many many toys.", Effectiveness = 3, Classes = new List<JunkClass>() { PowerStuff } };
            _junkTypeRepo.InsertOrUpdate(AABattery);
            var AAABattery = new JunkType() { Name = "AAA Battery", Description = "Used in many electronics.", Effectiveness = 6, Classes = new List<JunkClass>() { PowerStuff } };
            _junkTypeRepo.InsertOrUpdate(AAABattery);
            var LiIonBattery = new JunkType() { Name = "Lithium-ion Battery", Description = "Used in many electronics.", Effectiveness = 8, Classes = new List<JunkClass>() { PowerStuff } };
            _junkTypeRepo.InsertOrUpdate(LiIonBattery);
            var LiIonBatteryPack = new JunkType() { Name = "Lithium-ion Battery Pack", Description = "Used in cell phones and computers.", Effectiveness = 10, Classes = new List<JunkClass>() { PowerStuff } };
            _junkTypeRepo.InsertOrUpdate(LiIonBatteryPack);
            //TalkyStuff
            var ToyTwoWayRadio = new JunkType() { Name = "Kid's Two Way Radio", Description = "Better than a string and tin cans.", Effectiveness = 3, Classes = new List<JunkClass>() { TalkyStuff } };
            _junkTypeRepo.InsertOrUpdate(ToyTwoWayRadio);
            var TwoWayRadio = new JunkType() { Name = "Two Way Radio", Description = "Good for keeping track of each other at the zoo.", Effectiveness = 5, Classes = new List<JunkClass>() { TalkyStuff } };
            _junkTypeRepo.InsertOrUpdate(TwoWayRadio);
            var FlipPhone = new JunkType() { Name = "Flip Phone", Description = "So 90s.  1990s... The 20th century.  Nevermind!", Effectiveness = 7, Classes = new List<JunkClass>() { TalkyStuff, GeoStuff, ComputerStuff } };
            _junkTypeRepo.InsertOrUpdate(FlipPhone);
            var SmartPhone = new JunkType() { Name = "Smart Phone", Description = "Very smart.  Not just kinda smart.  Mensa smart.", Effectiveness = 10, Classes = new List<JunkClass>() { TalkyStuff, ComputerStuff, GeoStuff } };
            _junkTypeRepo.InsertOrUpdate(SmartPhone);
            //ReflectiveStuff
            var Mirror = new JunkType() { Name = "Mirror", Description = "Look! I can see myself!", Effectiveness = 10, Classes = new List<JunkClass>() { ReflectiveStuff } };
            _junkTypeRepo.InsertOrUpdate(Mirror);
            //ConductiveStuff
            var TinFoil = new JunkType() { Name = "Tin Foil", Description = "Used for baking and statellites", Effectiveness = 3, Classes = new List<JunkClass>() { ConductiveStuff } };
            _junkTypeRepo.InsertOrUpdate(TinFoil);
            var BareWire = new JunkType() { Name = "Bare Wire", Description = "Conducts electricity.", Effectiveness = 5, Classes = new List<JunkClass>() { ConductiveStuff } };
            _junkTypeRepo.InsertOrUpdate(BareWire);
            var CoatedWire = new JunkType() { Name = "Coated Wire", Description = "Conducts electricity.", Effectiveness = 7, Classes = new List<JunkClass>() { ConductiveStuff } };
            _junkTypeRepo.InsertOrUpdate(CoatedWire);
            //ButtonStuff
            var PushButton = new JunkType() { Name = "Pushbutton", Description = "You push it.", Effectiveness = 5, Classes = new List<JunkClass>() { ButtonStuff } };
            _junkTypeRepo.InsertOrUpdate(PushButton);
            //SwitchStuff
            var ToggleSwitch = new JunkType() { Name = "Toggle Switch", Description = "A switch with on and off.", Effectiveness = 5, Classes = new List<JunkClass>() { SwitchStuff } };
            _junkTypeRepo.InsertOrUpdate(ToggleSwitch);
            //ComputerStuff
            var LeapFishToyComputer = new JunkType() { Name = "Leap Fish Learning Computer", Description = "Please, will someone shut that thing off!!!", Effectiveness = 2, Classes = new List<JunkClass>() { ComputerStuff } };
            _junkTypeRepo.InsertOrUpdate(LeapFishToyComputer);
            var NerdKitProcessor = new JunkType() { Name = "Nerd Kit Processing Unit.", Description = "A small processin unit from a typical nerd kit.", Effectiveness = 5, Classes = new List<JunkClass>() { ComputerStuff } };
            _junkTypeRepo.InsertOrUpdate(NerdKitProcessor);
            var LaptopComputer = new JunkType() { Name = "Laptop Computer", Description = "A compact and powerful computer.", Effectiveness = 7, Classes = new List<JunkClass>() { ComputerStuff, GeoStuff } };
            _junkTypeRepo.InsertOrUpdate(LaptopComputer);
            //GeoStuff
            var NerdKitGeoSensor = new JunkType() { Name = "Geo Sensor", Description = "A gps unit from a typical nerd kit.", Effectiveness = 7, Classes = new List<JunkClass>() { GeoStuff } };
            _junkTypeRepo.InsertOrUpdate(NerdKitGeoSensor);
            var HandHeldGps = new JunkType() { Name = "Handheld Gps Unit", Description = "Accurate and fast geo tracking.", Effectiveness = 10, Classes = new List<JunkClass>() { GeoStuff } };
            _junkTypeRepo.InsertOrUpdate(HandHeldGps);
            await _junkTypeRepo.SaveAsync();

            //Item Classes===============================================================================================================
            var Satellites = new ItemClass() {Name = "Satellites", Description = "Orbital and 'Sub-Orbital' objects hurled through the air with rockets."};
            _itemClasseRepo.InsertOrUpdate(Satellites);
            var Scanners = new ItemClass() { Name = "Scanners", Description = "Used to reveal items and encounters in the world"};
            _itemClasseRepo.InsertOrUpdate(Scanners);
            await _itemClasseRepo.SaveAsync();

            //ItemTypes==================================================================================================================
            //Satellites
            var ShortRangeBallisticScanner = new ItemType() { Name = "Short Range Ballistic Scanner", ClassMultiplier = 4, Description = "A rudamentary scanner that you can attach to a basic rocket.", Classes = new List<ItemClass>() {Satellites, Scanners} };
            _itemTypeRepo.InsertOrUpdate(ShortRangeBallisticScanner);
            var LongRangeBallisticScanner = new ItemType() { Name = "Long Range Ballistic Scanner", ClassMultiplier = 7, Description = "A more advanced scanner that you can attach to a basic and advanced rockets.", Classes = new List<ItemClass>() { Satellites, Scanners } };
            _itemTypeRepo.InsertOrUpdate(LongRangeBallisticScanner);
            var BasicOrbitalSatellite = new ItemType() { Name = "Basic Orbital Satellite", ClassMultiplier = 12, Description = "A basic satellite to orbit the earth and gather information.  Limited orbits.", Classes = new List<ItemClass>() { Satellites, Scanners } };
            _itemTypeRepo.InsertOrUpdate(BasicOrbitalSatellite);
            var AdvancedOrbitalSatellite = new ItemType() { Name = "Advanced Orbital Satellite", ClassMultiplier = 20, Description = "An advanced satellite to orbit the earth and gather information.  Permanent orbit.", Classes = new List<ItemClass>() { Satellites, Scanners } };
            _itemTypeRepo.InsertOrUpdate(AdvancedOrbitalSatellite);
            //Scanners
            var ShortRangeHandheldScanner = new ItemType() { Name = "Short Range Handheld Scanner", ClassMultiplier = 1, Description = "A basic handheld device to reveal items on the map.  Limited uses.", Classes = new List<ItemClass>() { Scanners } };
            _itemTypeRepo.InsertOrUpdate(ShortRangeHandheldScanner);
            var LongRangeHandheldScanner = new ItemType() { Name = "Long Range Handheld Scanner", ClassMultiplier = 2, Description = "A more advanced handheld device to reveal items on the map.  Limited uses.", Classes = new List<ItemClass>() { Scanners } };
            _itemTypeRepo.InsertOrUpdate(LongRangeHandheldScanner);
            await _itemTypeRepo.SaveAsync();

            //Recipes==================================================================================================================
            var ShortRangeHandheldScannerRecipe = new Recipe() { Name = "Short Range Handheld Scanner Recipe",
                RecipeJunkClasses = new List<RecipeJunkClass>()
                {
                    new RecipeJunkClass() { Id = Guid.NewGuid(), JunkClass = PowerStuff, MinimumEffectiveness = 1 },
                    new RecipeJunkClass() { Id = Guid.NewGuid(), JunkClass = ConductiveStuff, MinimumEffectiveness = 1 },
                    new RecipeJunkClass() { Id = Guid.NewGuid(), JunkClass = ComputerStuff, MinimumEffectiveness = 1 },
                    new RecipeJunkClass() { Id = Guid.NewGuid(), JunkClass = StructuralStuff, MinimumEffectiveness = 1 },
                    new RecipeJunkClass() { Id = Guid.NewGuid(), JunkClass = StickyStuff, MinimumEffectiveness = 1 },
                    new RecipeJunkClass() { Id = Guid.NewGuid(), JunkClass = ButtonStuff, MinimumEffectiveness = 1 }
                 },
                OutputItem = ShortRangeHandheldScanner            
            };
            _recipeRepo.InsertOrUpdate(ShortRangeHandheldScannerRecipe)  ;
            await _recipeRepo.SaveAsync();

            var DansShortRangeHandheldScanner = new Item()
            {
                Id = Guid.Parse("51E195C0-42B8-4CC6-B3DB-E7E8F04E52F9"),
                Name = "Dan's Scanner",
                Effectiveness = 1,
                Type = ShortRangeHandheldScanner,
                Uses = 10000
            };
            _itemRepository.InsertOrUpdate(DansShortRangeHandheldScanner);
            await _itemRepository.SaveAsync();
        }
    }
}
