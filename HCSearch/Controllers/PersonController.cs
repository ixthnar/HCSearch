using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using HCSearch.Models;
using System.Net;
using System.Net.Http;
//using System.Web.Http;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace HCSearch.Controllers
{
    [Route("api/[controller]")]
    public class PersonController : Controller
    {
        public PersonContext personContext;

        public PersonController(PersonContext context)
        {
            personContext = context;
        }

        // GET: api/<controller>
        [HttpGet]
        public IActionResult Get(int? page = 1, int? pageSize = 10)
        {
            int pageValue = Math.Max(1,page.GetValueOrDefault(1));
            int pageSizeValue = Math.Max(1, pageSize.GetValueOrDefault(10));
            // page is 1 based
            var result = personContext.Persons.Skip(pageValue * pageSizeValue).Take(pageSizeValue)
                .Select(s => new PersonDetailView()
                {
                    id = s.Id,
                    nameFirst = s.NameFirst,
                    nameLast = s.NameLast,
                    addressStreet = s.AddressStreet,
                    addressCity = s.AddressCity,
                    addressState = s.AddressState,
                    addressZip = s.AddressZip,
                    addressCountry = s.AddressCountry,
                    dateOfBirth = s.DateOfBirth,
                    age = s.Age,
                    interests = s.Interests,
                    pictureBase64 = s.PictureBase64
                })
                .ToList();
            if (result.Count < 1)
                return NoContent();
            return Ok(result);
        }

        // GET api/<controller>/5
        [HttpGet("{id}")]
        public IActionResult Get(int id)
        {
            var result = personContext.Persons.Where(s => s.Id == id).FirstOrDefault();
            if (result == null)
                return NotFound();
            //result.PictureBase64 = Convert.ToBase64String(result.Picture, 0, result.Picture.Length);
            return Ok(result);
        }
    }
}
