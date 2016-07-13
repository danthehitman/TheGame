﻿using System;
using System.Collections.Generic;
using System.Data.Entity.Spatial;
using System.Linq;
using System.Linq.Expressions;
using System.Web;
using TheGameApi.Models;

namespace TheGameApi.DataAccess
{
    public interface IEncountersRepository : IDisposable
    {
        IQueryable<Encounter> All { get; }

        IQueryable<Encounter> AllIncluding(params Expression<Func<Encounter, object>>[] includeProperties);

        Encounter Find(int id);

        List<Encounter> Find(DbGeometry geom);

        void InsertOrUpdate(Encounter employee);

        void Delete(int id);

        void Save();
    }
}