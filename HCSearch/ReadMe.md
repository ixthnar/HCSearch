# The People Search Application
### Project notes for Health Catalyst candidate application
**by** Christopher D. Brown, cdb@ixthnar.com, 512 971-0909

## Setup
### Visual Studio Extensions
* __Markdown Editor__ by Mads Kristensen is needed to properly view this file, ReadMe.md
### Prerequisites
* Visual Studio 2017 or 2019, any edition is required to run and test this project
  * Configure Tools > Options > NuGet Package Manager > General enabling both "Package Restore" options
* SQL Server 2017 or higher Express, Developer, or a production version 
  * Full Text Search must be installed, enabled, and running
  * SSMS (SQL Server Management Studio) must be installed
  * In SSMS assure that Security > Logins has a Windows Authentication login for the account that will be running HCSearch
### Installation
* Clone solution from https://github.com/ixthnar/HCSearch.git
* Given everyone full control of .\HC\HCSearch\Data\HCSearch.mdf and .\HC\HCSearch\Data\HCSearch_log.ldf
* Using SSMS with server connected the account that will be running HCSearch
  * Attach database to SQL Server instance, .\HC\HCSearch\Data\HCSearch.mdf
  * Assure that the account can query the database using the statement
    * `USE HCSearch; SELECT TOP 1 * FROM Persons WHERE NameFirst LIKE '%a%'`
  * For database create info see the file, .\HC\HCSearch\Collateral\Database Create.sql

## Summary
HCSearch is a C#, .Net Core 2.2, React/Redux application that meets the stated requirements.  
It accesses, and does not update, a 50,000 person database.  Being somewhat new to React/Redux 
the UI is basic, front-end unit tests were deferred, and component/reducer usage is basic

## Requirements Analysis 
### Project Requirements
#### Stated Requirements
* GitHub
* .NET
* Software engineering principles and design patterns
* Minimal amount of setup
* instructions are included in a README
* Use of VS 2017 implied.  _**VS 2019** used with **VS 2017** compatibility verified._
### Business Requirements
#### Stated Requirements
* The application accepts search input in a text box and then displays in a 
pleasing style a list of people where any part of their first or last name 
matches what was typed in the search box (displaying at least name, address, 
age, interests, and a picture). 
* Solution should either seed data or provide a way to enter new users or both
* Simulate search being slow and have the UI gracefully handle the delay
#### Decisions
* Discover and use current best practices for search boxes including rapid and 
slow response techniques
* Content is name, address, birthday (to derive age), interests, and a picture content
* Only name is searchable
* Picture must be less the 1Mb supporting use of field storage (VARBINARY(MAX)) rather than FileStream
* Picture name and type are not retained since modern browsers are driven by the picture content
* Interests stored as JSON array stored as NVARCHAR(4000)
* Use seed data of 50,000 people with random ages and a picture that is the smallest valid jpeg file.
 See .\HC\HCSearch\Collateral\jpeg.jpg
* Option to create new users is deferred thus eliminating some security questions
#### Assumptions
* No stated security requirement; therefore, the application will be considered public
* The ability to simulate graceful degradation is covered in technical considerations
### Technical Requirements
#### Stated Requirements
* A Web Application using WebAPI and a front-end JavaScript framework (e.g., Angular, AngularJS, React, Aurelia, etc.) 
* Use an ORM framework to talk to the database
* Unit Tests for appropriate parts of the application 
#### Decisions
* .Net Core 2.2
* React Redux
* Entity Framework Core (SQL Server) 2.2.4 
* SQL Server Express 2017
* xUnit for .Net Core 2.2
* React unit testing not exploited due lack of knowledge/time
* React Redux usage leans too heavily on older AJAX ideas rather 
than exploiting the *right* use of components and reducers
* Performance consideration managed as follows
  * If typing gets ahead of predictions, the most recent change is queued to produce the next set
  * Clicking the search icon (magnifying glass) forces a lookup of the current search bar content
  * An in-code delay value can be used to simulate very slow responsiveness
#### Assumptions
* Security
  * SQL Server Express 2017 using integrated security
  * Opt out of name create/edit option so authentication not needed
* UI changes over performance gradients
  * Response times
    * \<= 60 ms: auto-fill (in place) and suggestions
    * 60 ms to 1000 ms: suggestions
    * \> 1000 ms: Not sure. Caching more important. No auto-complete?
  * Number of characters before auto-fill/auto-complete starts
    * \<= 60 ms: 1
    * 60 ms to 1000 ms: 2 or more driven by debouncing
    * \> 1000 ms: Not sure. Just wait for submit?
  * Prediction methods
    * Pruning result to first 20 matches
    * Caching **-- Out of scope**
    * Most recent first **-- Out of scope**
    * Language based **-- Out of scope**

## Design
### Database
* Repository and Unit of Work patterns
  * Inherent to Entity Framework Core
* Pictures are stored as VARBINARY (see [To BLOB or Not To BLOB: Large Object Storage in a Database or a Filesystem](https://www.microsoft.com/en-us/research/publication/to-blob-or-not-to-blob-large-object-storage-in-a-database-or-a-filesystem/?from=http%3A%2F%2Fresearch.microsoft.com%2Fapps%2Fpubs%2Fdefault.aspx%3Fid%3D64525))
* Using full text catalog / index with the `LIKE` operation for predictions
* __Full text search is not compatible with (localDb)__

## Resources
### Articles
* [Baymard Institute: 8 Design Patterns for Auto-complete Suggestions](https://baymard.com/blog/autocomplete-design)
* [File to hexadecimal converter](https://tomeko.net/online_tools/file_to_hex.php?lang=en)
* [small (github project of smallest possible files)](https://github.com/mathiasbynens/small/blob/master/jpeg.jpg)
* [How to throttle AND debounce an auto-complete input in React](https://www.peterbe.com/plog/how-to-throttle-and-debounce-an-autocomplete-input-in-react)
* [Measuring sequences of keystrokes with jsPsych](https://link.springer.com/article/10.3758/s13428-016-0776-3)
* [NN/g: Powers of 10: Time Scales in User Experience](https://www.nngroup.com/articles/powers-of-10-time-scales-in-ux/)
* [To BLOB or Not To BLOB: Large Object Storage in a Database or a Filesystem](https://www.microsoft.com/en-us/research/publication/to-blob-or-not-to-blob-large-object-storage-in-a-database-or-a-filesystem/?from=http%3A%2F%2Fresearch.microsoft.com%2Fapps%2Fpubs%2Fdefault.aspx%3Fid%3D64525)
* [UI Patterns: Auto-complete Design Pattern](http://ui-patterns.com/patterns/Autocomplete)
* [UX Collective: Best UX practices for search inputs](https://uxdesign.cc/best-ux-practices-for-search-inputs-c44dba565448)
  * Right sized box with magnifying glass as submit button
  * Placeholder text "Search Names"
  * Auto-complete
