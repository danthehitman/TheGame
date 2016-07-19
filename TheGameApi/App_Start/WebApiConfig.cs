using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using Microsoft.Practices.Unity;
using TheGameApi.DataAccess;

namespace TheGameApi
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            var container = new UnityContainer();
            container.RegisterType<TheGameContext, TheGameContext>(new HierarchicalLifetimeManager());
            container.RegisterType<IDiscoveryRepository>(new ContainerControlledLifetimeManager(),
               new InjectionFactory(c => new DiscoveryRepository(c.Resolve<TheGameContext>())));
            container.RegisterType<IDiscoveryRepository, DiscoveryRepository>(new HierarchicalLifetimeManager());
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
