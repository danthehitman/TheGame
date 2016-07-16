namespace TheGameApi.Migrations
{
    using System.Collections.Generic;
    using System.Data.Entity.Migrations;
    using DataAccess;
    using Models;

    internal sealed class Configuration : DbMigrationsConfiguration<TheGameApi.DataAccess.TheGameContext>
    {
        private JunkClassRepository _junkClassRepo;
        private JunkTypeRepository _junkTypeRepo;
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
            SeedStuff();
        }

        private void SeedStuff()
        {
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
            _junkClassRepo.Save();

            //Junk Types===============================================================================================================
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
            var BareWire = new JunkType() { Name = "Bare Wire", Description = "Conducts electecity.", Effectiveness = 5, Classes = new List<JunkClass>() { ConductiveStuff } };
            _junkTypeRepo.InsertOrUpdate(BareWire);
            var CoatedWire = new JunkType() { Name = "Coated Wire", Description = "Conducts electecity.", Effectiveness = 7, Classes = new List<JunkClass>() { ConductiveStuff } };
            _junkTypeRepo.InsertOrUpdate(CoatedWire);

            _junkTypeRepo.Save();
        }
    }
}
