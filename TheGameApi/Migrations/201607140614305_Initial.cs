namespace TheGameApi.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Discoveries",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        PointGeometry = c.Geometry(),
                        Date = c.DateTime(nullable: false),
                        Discoverer_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Users", t => t.Discoverer_Id)
                .Index(t => t.Discoverer_Id);
            
            CreateTable(
                "dbo.Users",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Email = c.String(),
                        EnrollDate = c.DateTime(nullable: false),
                        Password = c.String(),
                        Gold = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Encounters",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        PointGeometry = c.Geometry(),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.ItemClasses",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Items",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                        Quality = c.Int(nullable: false),
                        Class_Id = c.Guid(),
                        Owner_Id = c.Guid(),
                        Type_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ItemClasses", t => t.Class_Id)
                .ForeignKey("dbo.Users", t => t.Owner_Id)
                .ForeignKey("dbo.ItemTypes", t => t.Type_Id)
                .Index(t => t.Class_Id)
                .Index(t => t.Owner_Id)
                .Index(t => t.Type_Id);
            
            CreateTable(
                "dbo.ItemTypes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                        Image = c.String(),
                        Recipe_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Recipes", t => t.Recipe_Id)
                .Index(t => t.Recipe_Id);
            
            CreateTable(
                "dbo.Junks",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Quality = c.Int(nullable: false),
                        Class_Id = c.Guid(),
                        Owner_Id = c.Guid(),
                        Type_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.JunkClasses", t => t.Class_Id)
                .ForeignKey("dbo.Users", t => t.Owner_Id)
                .ForeignKey("dbo.JunkTypes", t => t.Type_Id)
                .Index(t => t.Class_Id)
                .Index(t => t.Owner_Id)
                .Index(t => t.Type_Id);
            
            CreateTable(
                "dbo.JunkClasses",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.JunkTypes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                        Image = c.String(),
                        Recipe_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Recipes", t => t.Recipe_Id)
                .Index(t => t.Recipe_Id);
            
            CreateTable(
                "dbo.Recipes",
                c => new
                    {
                        Id = c.Guid(nullable: false),
                        Name = c.String(),
                        Description = c.String(),
                        Output_Id = c.Guid(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.ItemTypes", t => t.Output_Id)
                .Index(t => t.Output_Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Recipes", "Output_Id", "dbo.ItemTypes");
            DropForeignKey("dbo.JunkTypes", "Recipe_Id", "dbo.Recipes");
            DropForeignKey("dbo.ItemTypes", "Recipe_Id", "dbo.Recipes");
            DropForeignKey("dbo.Junks", "Type_Id", "dbo.JunkTypes");
            DropForeignKey("dbo.Junks", "Owner_Id", "dbo.Users");
            DropForeignKey("dbo.Junks", "Class_Id", "dbo.JunkClasses");
            DropForeignKey("dbo.Items", "Type_Id", "dbo.ItemTypes");
            DropForeignKey("dbo.Items", "Owner_Id", "dbo.Users");
            DropForeignKey("dbo.Items", "Class_Id", "dbo.ItemClasses");
            DropForeignKey("dbo.Discoveries", "Discoverer_Id", "dbo.Users");
            DropIndex("dbo.Recipes", new[] { "Output_Id" });
            DropIndex("dbo.JunkTypes", new[] { "Recipe_Id" });
            DropIndex("dbo.Junks", new[] { "Type_Id" });
            DropIndex("dbo.Junks", new[] { "Owner_Id" });
            DropIndex("dbo.Junks", new[] { "Class_Id" });
            DropIndex("dbo.ItemTypes", new[] { "Recipe_Id" });
            DropIndex("dbo.Items", new[] { "Type_Id" });
            DropIndex("dbo.Items", new[] { "Owner_Id" });
            DropIndex("dbo.Items", new[] { "Class_Id" });
            DropIndex("dbo.Discoveries", new[] { "Discoverer_Id" });
            DropTable("dbo.Recipes");
            DropTable("dbo.JunkTypes");
            DropTable("dbo.JunkClasses");
            DropTable("dbo.Junks");
            DropTable("dbo.ItemTypes");
            DropTable("dbo.Items");
            DropTable("dbo.ItemClasses");
            DropTable("dbo.Encounters");
            DropTable("dbo.Users");
            DropTable("dbo.Discoveries");
        }
    }
}
