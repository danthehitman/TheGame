using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DotSpatial.Data;
using DotSpatial.Topology;
using DotSpatial.Analysis;
using Newtonsoft.Json;
using TheGameApi.DataAccess;

namespace TheGameApi.Models
{
    public class EncountersController : ApiController
    {
        EncounterRepository encRepo = new EncounterRepository();
        // GET: api/Encounters
        public string Get([FromUri]double lat, [FromUri]double lng)
        {
            var pnt = new Point(lat, lng);
            Polygon pg = pnt.Buffer(.1) as Polygon;
            var p = DbGeometry.FromText(pg.ToText());
            var encounters = encRepo.Find(p);
            //var encounters = encRepo.All;
            return JsonConvert.SerializeObject(encounters);
        }

        // GET: api/Encounters/5
        public string Get(int id)
        {
            return null;
        }

        // POST: api/Encounters
        public string Post([FromBody]GoogleLatLng point)
        {
            //Coordinate[] coords = new Coordinate[polyPoints.Count];
            //for (int i = 0; i < polyPoints.Count; i++)
            //{
            //    coords[i] = new Coordinate(polyPoints[i].Lat, polyPoints[i].Lng);
            //}
            //creates a new polygon from the coordinate array
            Point pt = new Point(point.Lat, point.Lng);
            Polygon pg = pt.Buffer(.1) as Polygon;

            List<List<double>> points = new List<List<double>>();

            Envelope env = pg.Envelope as Envelope;

            var sw = env.BottomLeft();
            var ne = env.TopRight();

            var rand = new Random();
            for (var i = 0; i < 100; i++)
            {
                var ptLat = rand.NextDouble() * (ne.X - sw.X) + sw.X;
                var ptLng = rand.NextDouble() * (ne.Y - sw.Y) + sw.Y;

                Point p = new Point(ptLat, ptLng);
                if (pg.Contains(p))
                {
                    points.Add(new List<double>() {ptLng, ptLat});
                    //encRepo.InsertOrUpdate(new Encounter()
                    //{
                    //    Name = $"Test{i}",
                    //    PointGeometry = DbGeometry.FromText(p.ToText())
                    //});
                }
            }
            //encRepo.Save();
            return JsonConvert.SerializeObject(points);
        }

        // PUT: api/Encounters/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE: api/Encounters/5
        public void Delete(int id)
        {
        }
    }
}
