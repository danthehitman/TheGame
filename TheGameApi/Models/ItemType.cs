﻿using System;
using System.Collections.Generic;

namespace TheGameApi.Models
{
    public class ItemType
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public ICollection<Recipe> Recipes { get; set; }
        public ICollection<ItemClass> Classes { get; set; }
        public int Effectiveness { get; set; }
    }
}