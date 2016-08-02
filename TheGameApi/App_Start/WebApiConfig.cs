using System.Web.Http;
using Microsoft.Practices.Unity;
using TheGameApi.Core.Services;
using TheGameApi.DataAccess;

namespace TheGameApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            var container = new UnityContainer();

            //TheGameContext context = new TheGameContext();
            container.RegisterType<IDiscoveryRepository>(new TransientLifetimeManager(),
               new InjectionFactory(c => new DiscoveryRepository()));
            container.RegisterType<ISessionRepository>(new TransientLifetimeManager(),
               new InjectionFactory(c => new SessionRepository()));
            container.RegisterType<IUserRepository>(new TransientLifetimeManager(),
               new InjectionFactory(c => new UserRepository()));
            container.RegisterType<IItemRepository>(new TransientLifetimeManager(),
               new InjectionFactory(c => new ItemRepository()));
            container.RegisterType<IJunkRepository>(new TransientLifetimeManager(),
               new InjectionFactory(c => new JunkRepository()));
            container.RegisterType<IJunkTypeRepository>(new TransientLifetimeManager(),
               new InjectionFactory(c => new JunkTypeRepository()));
            container.RegisterType<IItemTypeRepository>(new TransientLifetimeManager(),
               new InjectionFactory(c => new ItemTypeRepository()));
            container.RegisterType<IRecipeRepository>(new TransientLifetimeManager(),
               new InjectionFactory(c => new RecipeRepository()));
            container.RegisterType<IDiscoveryService>(new TransientLifetimeManager(),
                new InjectionFactory(c => new DiscoveryService(c.Resolve<IItemRepository>(),
                c.Resolve<IJunkRepository>(), c.Resolve<IDiscoveryRepository>(),
                c.Resolve<IJunkTypeRepository>(), c.Resolve<IItemTypeRepository>())));
            container.RegisterType<ICraftingService>(new TransientLifetimeManager(),
                new InjectionFactory(c => new CraftingService(c.Resolve<IItemRepository>(),
                c.Resolve<IJunkRepository>(), c.Resolve<IJunkTypeRepository>(), c.Resolve<IItemTypeRepository>())));


            config.DependencyResolver = new UnityResolver(container);

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
