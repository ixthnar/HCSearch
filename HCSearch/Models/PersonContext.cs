using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace HCSearch.Models
{
    public class PersonContext : DbContext
    {
        public PersonContext(DbContextOptions options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<PersonName>()
                .HasIndex(p => new { p.NameFirst, p.NameLast });
        }

        public DbSet<PersonName> PersonNames { get; set; }
        public DbSet<PersonInfo> PersonInfos { get; set; }
    }
}
