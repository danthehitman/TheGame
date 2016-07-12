using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DotSpatial.Data;
using DotSpatial.Topology;
using DotSpatial.Analysis;
using Newtonsoft.Json;

namespace TheGameApi.Models
{
    public class EncountersController : ApiController
    {
        // GET: api/Encounters
        public string Get()
        {
            Coordinate[] coords = new Coordinate[10];
            //creates a random point variable
            Random rnd = new Random();
            //Creates the center coordiante for the new polygon
            Coordinate center = new Coordinate((rnd.NextDouble() * 360) - 180, (rnd.NextDouble() * 180) - 90);
            //a for loop that generates a new random X and Y value and feeds those values into the coordinate array
            for (int i = 0; i < 10; i++)
            {
                coords[i] = new Coordinate(center.X + Math.Cos((i * 2) * Math.PI / 18), center.Y + (i * 2) * Math.PI / 18);
            }
            //creates a new polygon from the coordinate array
            coords[9] = new Coordinate(coords[0].X, coords[0].Y);
            Polygon pg = new Polygon(coords);

            //Feature f = new Feature();
            //FeatureSet fs = new FeatureSet(f.FeatureType);
            //fs.Features.Add(pg);

            //FeatureSet points = RandomGeometry.RandomPoints(fs, 10) as FeatureSet;

            //IMultiPoint pointsMp = points as IMultiPoint;
            //return pointsMp.ToString();

            List<List<double>> points = new List<List<double>>();

            Envelope env = pg.Envelope as Envelope;

            var sw = env.BottomLeft();
            var ne = env.TopRight();

            var rand = new Random();
            for (var i = 0; i < 100; i++)
            {
                var ptLat = rand.NextDouble() * (ne.Y - sw.X) + sw.X;
                var ptLng = rand.NextDouble() * (ne.X - sw.Y) + sw.Y;

                points.Add(new List<double>() { ptLng, ptLat });
            }
            return JsonConvert.SerializeObject(points);
        }

        // GET: api/Encounters/5
        public string Get(int id)
        {
            return null;
        }

        // POST: api/Encounters
        public void Post([FromBody]string value)
        {
            
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
