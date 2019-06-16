using System;
using Xunit;
using Microsoft.AspNetCore.TestHost;
using Microsoft.AspNetCore.Hosting;
using System.Net.Http;
using HCSearch;
using System.Threading.Tasks;
using System.Net;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Collections.Generic;
using HCSearch.Models;
using System.Linq;
using System.Globalization;

namespace HCSearchUnitTest
{
    public class PersonControllerTest
    {
        private readonly HttpClient _client;
        private string projectDir = @"..\HCSearch";

        public PersonControllerTest()
        {
            var curDir = System.IO.Directory.GetCurrentDirectory();
            projectDir = curDir.Substring(0, curDir.LastIndexOf("HCSearchUnitTest")) + "HCSearch";

            var server = new TestServer(
                new WebHostBuilder()
                    .UseEnvironment("Development")
                    .UseContentRoot(projectDir)
                    .UseConfiguration(new ConfigurationBuilder()
                        .SetBasePath(projectDir)
                        .AddJsonFile("appsettings.json")
                        .Build()
                    )
                    .UseStartup<Startup>()
            );
            _client = server.CreateClient();
        }

        [Fact]
        public void PersonGetAllTest()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/person");
            Task<HttpResponseMessage> task = _client.SendAsync(request);
            task.Wait();

            // We expect the Get to work
            Assert.Equal(TaskStatus.RanToCompletion, task.Status);

            // We expect the operation to succeed
            var response = task.Result;
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public void PersonGetPaging()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/person?page=2&pageSize=20");
            Task<HttpResponseMessage> task = _client.SendAsync(request);
            task.Wait();
            var response = task.Result;
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var data = response.Content.ReadAsStringAsync().Result;
            List<Person> persons = JsonConvert.DeserializeObject<List<Person>>(data);
            Assert.Equal(20, persons.Count);
        }

        [Fact]
        public void PersonKnown()
        {
            string pictureString = "FFD8FFDB004300030202020202030202020303030304060404040404080606050609080A0A090809090A0C0F0C0A0B0E0B09090D110D0E0F101011100A0C12131210130F101010FFC9000B080001000101011100FFCC000600101005FFDA0008010100003F00D2CF20FFD9";
            byte[] picture = Enumerable.Range(0, pictureString.Length)
                     .Where(x => x % 2 == 0).Select(x => Convert.ToByte(pictureString.Substring(x, 2), 16))
                     .ToArray();
            Person personTest = new Person() {
                Id = 5,
                NameFirst = "Malia",
                NameLast = "Floerchinger",
                AddressStreet = "968 W 5th St",
                AddressCity = "New York",
                AddressState = "NY",
                AddressZip = "10013",
                AddressCountry = "United States",
                DateOfBirth = DateTime.ParseExact("1966-04-22", "yyyy-MM-dd", CultureInfo.InvariantCulture),
                Interests = "['Strategic Games','Stamp Collecting','Bird Watching','Gardening','Puzzles and Chess']",
                Picture = picture
            };
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/person/" + personTest.Id);
            Task<HttpResponseMessage> task = _client.SendAsync(request);
            task.Wait();
            var response = task.Result;
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var data = response.Content.ReadAsStringAsync().Result;
            Person person = JsonConvert.DeserializeObject<Person>(data);
            Assert.Equal<Person>(personTest, person, new PersonComparer());
        }
    }

    public class PersonComparer : IEqualityComparer<Person>
    {
        public bool Equals(Person p1, Person p2)
        {
            bool isSame = true;
            string mismatchedProps = string.Empty;
            foreach (var prop in typeof(Person).GetProperties())
            {
                if (prop.PropertyType.IsArray)
                {
                    var a1 = (byte[])prop.GetValue(p1);
                    var a2 = (byte[])prop.GetValue(p2);
                    if (a1.Length != a2.Length)
                    {
                        isSame = false;
                        mismatchedProps += prop.Name + "\n";
                    }
                    else
                    {
                        for (int ix = 0; ix < a1.Length; ++ix)
                        {
                            if (!a1[ix].Equals(a2[ix]))
                            {
                                isSame = false;
                                mismatchedProps += string.Format("{0}[{1}]\n", prop.Name, ix);
                                break;
                            }
                        }
                    }
                }
                else if (!prop.GetValue(p1).Equals(prop.GetValue(p2)))
                {
                    isSame = false;
                    mismatchedProps += prop.Name + "\n";
                }
            }
            return isSame;
        }

        public int GetHashCode(Person obj)
        {
            return obj.Id.GetHashCode();
        }
    }
}
