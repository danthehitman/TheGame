using System.Collections.Generic;
using AutoMapper;
using TheGameApi.Controllers.Models;
using TheGameApi.Models;

namespace TheGameApi
{
    public static class AutoMapperConfig
    {
        public static void RegisterMappings()
        {
            Mapper.Initialize(cfg => {
                cfg.CreateMap<ItemClass, ItemClassDto>();

                cfg.CreateMap<RecipeItemClass, RecipeItemClassDto>();

                cfg.CreateMap<ItemType, ItemTypeDto>()
                .ForMember(e => e.Classes, opt => opt.MapFrom(q => Mapper.Map<ICollection<ItemClass>, ICollection<ItemClassDto>>(q.Classes)));

                cfg.CreateMap<JunkClass, JunkClassDto>();

                cfg.CreateMap<RecipeJunkClass, RecipeJunkClassDto>();

                cfg.CreateMap<JunkType, JunkTypeDto>()
                .ForMember(e => e.Classes, opt => opt.MapFrom(q => Mapper.Map<ICollection<JunkClass>, ICollection<JunkClassDto>>(q.Classes)));

                cfg.CreateMap<Recipe, RecipeDto>()
                .ForMember(e => e.ItemTypes, opt => opt.MapFrom(q => Mapper.Map<ICollection<ItemType>, ICollection<ItemTypeDto>>(q.ItemTypes)))
                .ForMember(e => e.JunkTypes, opt => opt.MapFrom(q => Mapper.Map<ICollection<JunkType>, ICollection<JunkTypeDto>>(q.JunkTypes)))
                .ForMember(e => e.RecipeItemClasses, opt => opt.MapFrom(q => Mapper.Map<ICollection<RecipeItemClass>, ICollection<RecipeItemClassDto>>(q.RecipeItemClasses)))
                .ForMember(e => e.RecipeJunkClasses, opt => opt.MapFrom(q => Mapper.Map<ICollection<RecipeJunkClass>, ICollection<RecipeJunkClassDto>>(q.RecipeJunkClasses)))
                .ForMember(e => e.OutputItem, opt => opt.MapFrom(q => Mapper.Map<ItemType, ItemTypeDto>(q.OutputItem)));

                cfg.CreateMap<Item, ItemDto>()
                .ForMember(d => d.LootType, opt => opt.MapFrom(i => i.LootType.ToString()))
                .ForMember(e => e.Type, opt => opt.MapFrom(q => Mapper.Map<ItemType, ItemTypeDto>(q.Type)))
                .ForMember(d => d.Quality, opt => opt.MapFrom(i => i.Quality.ToString()));

                cfg.CreateMap<Junk, JunkDto>()
                .ForMember(d => d.LootType, opt => opt.MapFrom(j => j.LootType.ToString()))
                .ForMember(e => e.Type, opt => opt.MapFrom(q => Mapper.Map<JunkType, JunkTypeDto>(q.Type)))
                .ForMember(d => d.Quality, opt => opt.MapFrom(j => j.Quality.ToString())); ;

                cfg.CreateMap<User, UserDto>();
            });
        }
    }
}