using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using HCSearch.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HCSearch.Controllers
{
    [Route("api/[controller]")]
    public class SearchController : Controller
    {
        public PersonContext personContext;

        public SearchController(PersonContext context)
        {
            personContext = context;
        }
        [HttpGet]
        public IActionResult GetAll(int? page = 1, int? pageSize = 10)
        {
            return Get(string.Empty, page, pageSize);
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public IActionResult Get(string id, int? page = 1, int? pageSize = 10)
        {
            if (string.IsNullOrWhiteSpace(id))
                id = string.Empty;

            // This protects from injection exploits for JavaScript, SQL, and SQL Like
            string idValue = Regex.Replace(WebUtility.UrlDecode(id), "[^a-zA-Z0-9.' ]+", "", RegexOptions.Compiled)
                .Replace("'", "''") // Escape apostrophes
                .Trim();

            // Further parameter cleaning
            int pageValue = Math.Max(1, page.GetValueOrDefault(1));
            int pageSizeValue = Math.Max(1, pageSize.GetValueOrDefault(10));

            // Form a where matches each typed space separated string in first or last names
            string likeClause = string.Empty;
            foreach (var item in idValue.Split(' '))
            {
                if (!string.IsNullOrEmpty(item))
                {
                    if (likeClause.Length > 0)
                        likeClause += " AND ";
                    likeClause += string.Format("((NameFirst LIKE '%{0}%') OR (NameLast LIKE '%{0}%'))", item);
                }
            }

            // The above protects from incoming text with injection exploits for JavaScript, SQL, and SQL Like
#pragma warning disable EF1000
            var result = personContext.Persons
                .FromSql("SELECT Id, NameFirst, NameLast FROM Persons" + (likeClause.Length > 0 ? " WHERE " + likeClause : ""))
                .Select(s => new PersonSearch() { Id = s.Id, NameFirst = s.NameFirst, NameLast = s.NameLast })
                .Skip(pageValue * pageSizeValue).Take(pageSizeValue).ToList();
            return Ok(result);
        }
    }
}
