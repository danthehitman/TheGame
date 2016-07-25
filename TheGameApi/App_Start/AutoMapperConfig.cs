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
                cfg.CreateMap<Item, ItemDto>()
                .ForMember(d => d.LootType, opt => opt.MapFrom(i => i.LootType.ToString()))
                .ForMember(d => d.Quality, opt => opt.MapFrom(i => i.Quality.ToString()));
                cfg.CreateMap<Junk, JunkDto>()
                .ForMember(d => d.LootType, opt => opt.MapFrom(j => j.LootType.ToString()))
                .ForMember(d => d.Quality, opt => opt.MapFrom(j => j.Quality.ToString())); ;
                cfg.CreateMap<User, UserDto>();
            });
        }
    }
}