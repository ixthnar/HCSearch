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
    public class SearchControllerTest
    {
        private readonly HttpClient _client;
        private string projectDir = @"..\HCSearch";

        public SearchControllerTest()
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
        public void SearchGetAllTest()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/search");
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
        public void SearchGetPaging()
        {
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/search?page=2&pageSize=20");
            Task<HttpResponseMessage> task = _client.SendAsync(request);
            task.Wait();
            var response = task.Result;
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var data = response.Content.ReadAsStringAsync().Result;
            List<PersonSearch> Searchs = JsonConvert.DeserializeObject<List<PersonSearch>>(data);
            Assert.Equal(20, Searchs.Count);
        }

        [Fact]
        public void SearchKnown()
        {
            PersonSearch searchTest = new PersonSearch()
            {
                Id = 5,
                NameFirst = "Malia",
                NameLast = "Floerchinger"
            };
            string searchText = WebUtility.UrlEncode(string.Format("{0} {1}", searchTest.NameFirst, searchTest.NameLast));
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/search/" + WebUtility.UrlEncode(searchText));
            Task<HttpResponseMessage> task = _client.SendAsync(request);
            task.Wait();
            var response = task.Result;
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var data = response.Content.ReadAsStringAsync().Result;
            List<PersonSearch> search = JsonConvert.DeserializeObject<List<PersonSearch>>(data);
            int resultCount = search.Count;
            Assert.Equal<int>(1, resultCount);
            Assert.Equal<PersonSearch>(searchTest, search[0], new PersonSearchComparer());
        }

        [Fact]
        public void SearchPattern()
        {
            const string searchText = "chri br";
            const int knownCount = 7;
            /*
             * Id	    NameFirst	NameLast
             * 4917	    Christeen	Brasil
             * 5427	    Christene	Sensenbrenner
             * 7423	    Christopher	Brasuell
             * 10792	    Christin	    Disbro
             * 12469	    Christian	Broas
             * 41877	    Christi	    Galbreath
             * 47381	    Christine	Philbrick
             */
            var request = new HttpRequestMessage(HttpMethod.Get, "/api/search/" + WebUtility.UrlEncode(searchText));
            Task<HttpResponseMessage> task = _client.SendAsync(request);
            task.Wait();
            var response = task.Result;
            response.EnsureSuccessStatusCode();
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
            var data = response.Content.ReadAsStringAsync().Result;
            List<PersonSearch> search = JsonConvert.DeserializeObject<List<PersonSearch>>(data);
            Assert.Equal<int>(knownCount, search.Count);
        }
    }

    public class PersonSearchComparer : IEqualityComparer<PersonSearch>
    {
        public bool Equals(PersonSearch p1, PersonSearch p2)
        {
            bool isSame = true;
            string mismatchedProps = string.Empty;
            foreach (var prop in typeof(PersonSearch).GetProperties())
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

        public int GetHashCode(PersonSearch obj)
        {
            return obj.Id.GetHashCode();
        }
    }
}
